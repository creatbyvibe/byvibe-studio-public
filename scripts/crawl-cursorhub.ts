import { load } from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

interface ScrapedData {
  url: string;
  title: string;
  description?: string;
  sections: {
    title: string;
    content: string;
  }[];
  links: {
    text: string;
    url: string;
  }[];
  timestamp: string;
}

/**
 * 爬取单个页面
 */
async function crawlPage(url: string): Promise<ScrapedData> {
  try {
    console.log(`正在爬取: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = load(html);

    // 提取标题
    const title = $('title').text().trim() || $('h1').first().text().trim();

    // 提取描述（meta description 或第一个段落）
    const description = 
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      $('p').first().text().trim();

    // 提取主要章节
    const sections: { title: string; content: string }[] = [];
    
    // 提取所有 h2, h3 标题及其内容
    $('h2, h3').each((_, element) => {
      const $heading = $(element);
      const headingText = $heading.text().trim();
      
      if (headingText) {
        let content = '';
        let $next = $heading.next();
        
        // 收集直到下一个标题的所有内容
        while ($next.length && !$next.is('h1, h2, h3')) {
          if ($next.is('p, div, ul, ol, li')) {
            const text = $next.text().trim();
            if (text) {
              content += text + '\n';
            }
          }
          $next = $next.next();
        }
        
        sections.push({
          title: headingText,
          content: content.trim(),
        });
      }
    });

    // 如果没有找到章节，尝试提取主要段落
    if (sections.length === 0) {
      $('p').each((_, element) => {
        const text = $(element).text().trim();
        if (text.length > 50) { // 只保存有意义的段落
          sections.push({
            title: '段落',
            content: text,
          });
        }
      });
    }

    // 提取所有链接
    const links: { text: string; url: string }[] = [];
    $('a[href]').each((_, element) => {
      const $link = $(element);
      const text = $link.text().trim();
      let href = $link.attr('href') || '';
      
      // 处理相对链接
      if (href && !href.startsWith('http')) {
        const baseUrl = new URL(url);
        href = new URL(href, baseUrl.origin).href;
      }
      
      if (text && href) {
        links.push({ text, url: href });
      }
    });

    return {
      url,
      title,
      description,
      sections,
      links,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`爬取失败 ${url}:`, error);
    throw error;
  }
}

/**
 * 主函数
 */
async function main() {
  const baseUrl = 'https://cursorhub.org/';
  const outputDir = path.join(process.cwd(), 'data', 'cursorhub');
  
  // 创建输出目录
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    console.error('创建目录失败:', error);
  }

  try {
    // 爬取主页
    console.log('开始爬取 Cursor Hub 网站...\n');
    const homePage = await crawlPage(baseUrl);
    
    // 保存主页数据
    const homePagePath = path.join(outputDir, 'homepage.json');
    await fs.writeFile(
      homePagePath,
      JSON.stringify(homePage, null, 2),
      'utf-8'
    );
    console.log(`✓ 主页数据已保存到: ${homePagePath}`);

    // 从主页提取的其他页面链接
    const otherPages = new Set<string>();
    homePage.links.forEach(link => {
      if (link.url.includes('cursorhub.org') && link.url !== baseUrl) {
        otherPages.add(link.url);
      }
    });

    // 爬取其他页面（限制前5个，避免过载）
    const pagesToCrawl = Array.from(otherPages).slice(0, 5);
    const allPages = [homePage];

    for (const pageUrl of pagesToCrawl) {
      try {
        // 添加延迟，避免请求过快
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const pageData = await crawlPage(pageUrl);
        allPages.push(pageData);
        
        // 保存单个页面
        const fileName = pageUrl
          .replace(/^https?:\/\//, '')
          .replace(/[^a-zA-Z0-9]/g, '_')
          .substring(0, 50) + '.json';
        const filePath = path.join(outputDir, fileName);
        await fs.writeFile(
          filePath,
          JSON.stringify(pageData, null, 2),
          'utf-8'
        );
        console.log(`✓ 页面数据已保存到: ${filePath}`);
      } catch (error) {
        console.error(`跳过页面 ${pageUrl}:`, error);
      }
    }

    // 保存汇总数据
    const summary = {
      totalPages: allPages.length,
      crawledAt: new Date().toISOString(),
      pages: allPages.map(page => ({
        url: page.url,
        title: page.title,
        sectionCount: page.sections.length,
        linkCount: page.links.length,
      })),
    };

    const summaryPath = path.join(outputDir, 'summary.json');
    await fs.writeFile(
      summaryPath,
      JSON.stringify(summary, null, 2),
      'utf-8'
    );
    console.log(`\n✓ 汇总数据已保存到: ${summaryPath}`);

    // 生成可读的文本报告
    const reportPath = path.join(outputDir, 'report.txt');
    let report = `Cursor Hub 网站爬取报告\n`;
    report += `生成时间: ${new Date().toLocaleString('zh-CN')}\n`;
    report += `共爬取 ${allPages.length} 个页面\n\n`;
    report += '='.repeat(80) + '\n\n';

    allPages.forEach((page, index) => {
      report += `页面 ${index + 1}: ${page.title}\n`;
      report += `URL: ${page.url}\n`;
      if (page.description) {
        report += `描述: ${page.description.substring(0, 200)}...\n`;
      }
      report += `章节数: ${page.sections.length}\n`;
      report += `链接数: ${page.links.length}\n\n`;
      
      if (page.sections.length > 0) {
        report += '主要章节:\n';
        page.sections.slice(0, 5).forEach((section, i) => {
          report += `  ${i + 1}. ${section.title}\n`;
          if (section.content) {
            report += `     ${section.content.substring(0, 100)}...\n`;
          }
        });
        report += '\n';
      }
      report += '-'.repeat(80) + '\n\n';
    });

    await fs.writeFile(reportPath, report, 'utf-8');
    console.log(`✓ 文本报告已保存到: ${reportPath}`);

    console.log('\n✅ 爬取完成！');
    console.log(`所有数据保存在: ${outputDir}`);

  } catch (error) {
    console.error('爬取过程中出现错误:', error);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

export { crawlPage };
export type { ScrapedData };
