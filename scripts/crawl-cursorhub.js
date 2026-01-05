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

  // 提取所有 h2, h3 标题
  const headingRegex = /<h([23])[^>]*>([^<]+)<\/h[23]>/gi;
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    result.sections.push({
      level: match[1],
      title: match[2].trim(),
      content: '', // 简化版本不提取内容
    });
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
        content: s.content,
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
