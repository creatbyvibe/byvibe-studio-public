const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 创建 logos 目录
const logosDir = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Logo 下载配置
// 使用 Simple Icons CDN 或官方资源
const logos = [
  {
    name: 'openai',
    url: 'https://cdn.simpleicons.org/openai/412991',
    filename: 'openai.svg',
    fallback: true, // 如果下载失败，创建 fallback SVG
    color: '#412991',
  },
  {
    name: 'vercel',
    url: 'https://cdn.simpleicons.org/vercel/000000',
    filename: 'vercel.svg',
  },
  {
    name: 'cursor',
    url: 'https://cdn.simpleicons.org/cursor/000000',
    filename: 'cursor.svg',
  },
  {
    name: 'supabase',
    url: 'https://cdn.simpleicons.org/supabase/3ECF8E',
    filename: 'supabase.svg',
  },
  {
    name: 'cloudflare',
    url: 'https://cdn.simpleicons.org/cloudflare/F38020',
    filename: 'cloudflare.svg',
  },
  {
    name: 'github',
    url: 'https://cdn.simpleicons.org/github/181717',
    filename: 'github.svg',
  },
  {
    name: 'google',
    url: 'https://cdn.simpleicons.org/google/4285F4',
    filename: 'google.svg',
  },
  {
    name: 'anthropic',
    url: 'https://cdn.simpleicons.org/anthropic/000000',
    filename: 'anthropic.svg',
  },
  {
    name: 'replicate',
    url: 'https://cdn.simpleicons.org/replicate/000000',
    filename: 'replicate.svg',
  },
  {
    name: 'togetherai',
    url: 'https://cdn.simpleicons.org/togetherai/000000',
    filename: 'togetherai.svg',
    fallback: true,
    color: '#00B4D8',
  },
  {
    name: 'v0',
    url: 'https://cdn.simpleicons.org/vercel/000000', // v0 is by Vercel
    filename: 'v0.svg',
  },
  {
    name: 'codeium',
    url: 'https://cdn.simpleicons.org/codeium/000000',
    filename: 'codeium.svg',
    fallback: true,
    color: '#6366F1',
  },
  {
    name: 'lovable',
    url: 'https://cdn.simpleicons.org/lovable/000000',
    filename: 'lovable.svg',
    fallback: true,
    color: '#EF4444',
  },
  {
    name: 'bolt',
    url: 'https://cdn.simpleicons.org/bolt/000000',
    filename: 'bolt.svg',
    fallback: true,
    color: '#F59E0B',
  },
  {
    name: 'stabilityai',
    url: 'https://cdn.simpleicons.org/stabilityai/000000',
    filename: 'stabilityai.svg',
    fallback: true,
    color: '#000000',
  },
];

// 下载函数
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const options = {
      rejectUnauthorized: false, // 允许自签名证书（仅用于开发环境）
    };
    
    protocol.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // 处理重定向
        return downloadFile(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {}); // 删除不完整的文件
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 创建 fallback SVG
function createFallbackSVG(name, color, filepath) {
  // 简单的 SVG 占位符，使用品牌颜色
  const svg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" rx="4" fill="${color}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${name.substring(0, 2).toUpperCase()}</text>
</svg>`;
  
  fs.writeFileSync(filepath, svg);
  console.log(`✓ Created fallback SVG: ${path.basename(filepath)}`);
}

// 主函数
async function downloadAllLogos() {
  console.log('Starting logo downloads...\n');
  
  const results = {
    success: [],
    failed: [],
    fallback: [],
  };

  for (const logo of logos) {
    const filepath = path.join(logosDir, logo.filename);
    
    try {
      await downloadFile(logo.url, filepath);
      results.success.push(logo.name);
    } catch (error) {
      console.error(`✗ Failed to download ${logo.name}: ${error.message}`);
      
      // 如果配置了 fallback，创建 SVG fallback
      if (logo.fallback && logo.color) {
        try {
          createFallbackSVG(logo.name, logo.color, filepath);
          results.fallback.push(logo.name);
        } catch (fallbackError) {
          results.failed.push({ name: logo.name, error: error.message });
        }
      } else {
        results.failed.push({ name: logo.name, error: error.message });
      }
    }
  }

  console.log('\n=== Download Summary ===');
  console.log(`✓ Successfully downloaded: ${results.success.length} logos`);
  if (results.fallback.length > 0) {
    console.log(`✓ Created fallback SVGs: ${results.fallback.length} logos`);
    results.fallback.forEach((name) => {
      console.log(`  - ${name}`);
    });
  }
  if (results.failed.length > 0) {
    console.log(`✗ Failed: ${results.failed.length} logos`);
    results.failed.forEach(({ name, error }) => {
      console.log(`  - ${name}: ${error}`);
    });
  }
  console.log(`\nLogos saved to: ${logosDir}`);
}

// 运行脚本
downloadAllLogos().catch(console.error);
