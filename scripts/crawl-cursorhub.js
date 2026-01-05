// 使用原生 fetch 的简化版本（无需额外依赖）
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');

/**
 * 发送 HTTP 请求
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        },
      };

      // 如果是 HTTPS，添加 SSL 选项（开发环境可以忽略证书错误）
      if (isHttps) {
        options.rejectUnauthorized = false; // 仅用于开发环境
      }
      
      const req = client.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({ status: res.statusCode, data });
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 简单的 HTML 解析器（提取基本信息）
 */
function parseHTML(html) {
  const result = {
    title: '',
    description: '',
    sections: [],
    links: [],
  };

  // 提取标题
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    result.title = titleMatch[1].trim();
  }

  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match && !result.title) {
    result.title = h1Match[1].trim();
  }

  // 提取描述
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (descMatch) {
    result.description = descMatch[1].trim();
  }

  // 提取所有标题及其内容
  // 首先找到所有标题的位置
  const headingRegex = /<h([123])[^>]*>([^<]+)<\/h[123]>/gi;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      title: match[2].trim(),
      index: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  // 为每个标题提取后续内容（直到下一个同级或更高级的标题）
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const nextHeading = headings.find((h, idx) => idx > i && h.level <= heading.level);
    const startIndex = heading.endIndex;
    const endIndex = nextHeading ? nextHeading.index : html.length;

    // 提取这个范围内的文本内容
    let contentHtml = html.substring(startIndex, endIndex);
    
    // 移除 HTML 标签，只保留文本
    let content = contentHtml
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // 移除 script 标签
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // 移除 style 标签
      .replace(/<[^>]+>/g, ' ') // 移除所有 HTML 标签
      .replace(/&nbsp;/g, ' ') // 替换 &nbsp;
      .replace(/&amp;/g, '&') // 替换 &amp;
      .replace(/&lt;/g, '<') // 替换 &lt;
      .replace(/&gt;/g, '>') // 替换 &gt;
      .replace(/&quot;/g, '"') // 替换 &quot;
      .replace(/&#39;/g, "'") // 替换 &#39;
      .replace(/\s+/g, ' ') // 合并多个空格
      .trim();

    // 限制内容长度（避免过长）
    if (content.length > 1000) {
      content = content.substring(0, 1000) + '...';
    }

    result.sections.push({
      level: heading.level,
      title: heading.title,
      content: content,
    });
  }

  // 如果没有找到标题，尝试提取段落
  if (result.sections.length === 0) {
    const paragraphRegex = /<p[^>]*>([^<]+)<\/p>/gi;
    while ((match = paragraphRegex.exec(html)) !== null) {
      const text = match[1].trim();
      if (text.length > 30) { // 只保存有意义的段落
        result.sections.push({
          level: 0,
          title: '段落',
          content: text.substring(0, 500),
        });
      }
    }
  }

  // 提取链接
  const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[1];
    const text = match[2].trim();
    if (text && url) {
      result.links.push({ text, url });
    }
  }

  return result;
}

/**
 * 爬取单个页面
 */
async function crawlPage(url) {
  try {
    console.log(`正在爬取: ${url}`);
    
    const response = await fetchUrl(url);
    
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const parsed = parseHTML(response.data);
    
    return {
      url,
      title: parsed.title,
      description: parsed.description,
      sections: parsed.sections.map(s => ({
        title: s.title,
        content: s.content || '', // 确保 content 字段存在
      })),
      links: parsed.links,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`爬取失败 ${url}:`, error.message);
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

    // 从主页提取的其他页面链接（限制数量）
    const otherPages = new Set();
    const baseUrlObj = new URL(baseUrl);
    
    homePage.links.forEach(link => {
      let fullUrl = link.url;
      
      // 处理相对路径
      if (link.url.startsWith('/')) {
        fullUrl = baseUrlObj.origin + link.url;
      } else if (!link.url.startsWith('http')) {
        fullUrl = baseUrl + link.url;
      }
      
      // 只添加同域名的链接
      try {
        const urlObj = new URL(fullUrl);
        if (urlObj.hostname === baseUrlObj.hostname && fullUrl !== baseUrl) {
          // 排除锚点链接和特殊链接
          if (!fullUrl.includes('#') && !fullUrl.includes('mailto:') && !fullUrl.includes('tel:')) {
            otherPages.add(fullUrl);
          }
        }
      } catch (e) {
        // 忽略无效 URL
      }
    });

    // 爬取其他页面（限制前3个）
    const pagesToCrawl = Array.from(otherPages).slice(0, 3);
    const allPages = [homePage];

    for (const pageUrl of pagesToCrawl) {
      try {
        // 添加延迟，避免请求过快
        await new Promise(resolve => setTimeout(resolve, 2000));
        
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
        console.error(`跳过页面 ${pageUrl}:`, error.message);
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

module.exports = { crawlPage };
