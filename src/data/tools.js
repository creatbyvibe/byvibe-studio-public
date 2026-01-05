// 从 vibecoding.app 获取的 AI 工具数据
export const tools = [
  {
    id: 1,
    name: "Hostinger AI Hub",
    category: "Website & Business Tools",
    description: "AI-powered website creation and content tools to help anyone build and grow online faster.",
    pricing: "Included with all Hostinger plans",
    votes: 158,
    rating: 4.7,
    ratingSource: "Trustpilot",
    tags: ["AI Website Builder", "Content Generation", "Vibe Coding"],
    featured: true,
    imageUrl: "https://vibecoding.app/_next/image?url=%2Fhostinger-logo-square.png&w=3840&q=75",
    link: "https://vibecoding.app/tools/hostinger-ai-hub"
  },
  {
    id: 2,
    name: "LingGuang",
    category: "Vibe / No-Code Builders",
    description: "Ant Group's multimodal vibe-coding assistant that ships Flash Apps, 3D visuals, and real-time scene insights from a single prompt.",
    pricing: "Free early access in China (pricing TBA)",
    votes: 132,
    rating: 4.6,
    ratingSource: "Apple App Store",
    tags: ["Vibe Coding", "Multimodal AI", "Flash Apps"],
    new: true,
    imageUrl: null, // LingGuang 图片需要单独获取
    link: "https://vibecoding.app/tools/lingguang-vibe-coding-app"
  },
  {
    id: 3,
    name: "Google AntiGravity",
    category: "Developer IDEs & Agents",
    description: "Google's agent-first IDE with mission control, multi-agent workflows, and a built-in browser for testing complex coding tasks end-to-end.",
    pricing: "Free public preview with generous rate limits; paid tiers TBA",
    votes: 7000,
    rating: null,
    ratingSource: null,
    tags: ["Agentic IDE", "Multi-Agent Coding", "Built-in Browser"],
    new: true,
    imageUrl: "https://vibecoding.app/_next/image?url=https%3A%2F%2Fwww.google.com%2Fimages%2Fbranding%2Fgooglelogo%2F2x%2Fgooglelogo_color_92x30dp.png&w=3840&q=75",
    link: "https://vibecoding.app/tools/google-antigravity"
  },
  {
    id: 4,
    name: "Windsurf (formerly Codeium)",
    category: "Developer IDEs & Agents",
    description: "Windsurf (formerly Codeium) rebranded to spotlight its agentic IDE and plugin suite: Cascade handles multi-step coding, Tab/Supercomplete keeps completions fast, and the team highlights admin-grade security plus cloud, hybrid, or self-hosted deployment options.",
    pricing: "Free + Pro $15/mo + Teams $30/user/mo + Enterprise $60/user/mo (credits model)",
    votes: 8000,
    rating: null,
    ratingSource: null,
    tags: ["AI IDE", "Autonomous Coding", "Context Memory"],
    imageUrl: "https://vibecoding.app/_next/image?url=%2Flogos%2Fwindsurf.ico&w=3840&q=75",
    link: "https://vibecoding.app/tools/windsurf"
  },
  {
    id: 5,
    name: "Claude Code CLI",
    category: "AI Assistants & Code Review",
    description: "Command-line interface for Anthropic's Claude AI, designed for developers who prefer terminal-based workflows. Provides intelligent code analysis, generation, and review capabilities directly from the command line.",
    pricing: "Free with Claude API key, Usage-based pricing",
    votes: 6000,
    rating: null,
    ratingSource: null,
    tags: ["CLI Tool", "Claude AI", "Terminal"],
    imageUrl: "https://vibecoding.app/_next/image?url=%2Flogos%2Fclaude-code-cli.ico&w=3840&q=75",
    link: "https://vibecoding.app/tools/claude-code-cli"
  },
  {
    id: 6,
    name: "Gemini Code Assist",
    category: "AI Assistants & Code Review",
    description: "Google's AI coding assistant for supported IDEs and Google Cloud workflows.",
    pricing: "Free and paid tiers (varies by edition)",
    votes: 5500,
    rating: null,
    ratingSource: null,
    tags: ["Google", "Gemini", "IDE"],
    imageUrl: "https://vibecoding.app/_next/image?url=https%3A%2F%2Fwww.google.com%2Fimages%2Fbranding%2Fgooglelogo%2F2x%2Fgooglelogo_color_92x30dp.png&w=3840&q=75",
    link: "https://vibecoding.app/tools/gemini-code-assist"
  },
  {
    id: 7,
    name: "v0",
    category: "Vibe / No-Code Builders",
    description: "AI-powered design-to-code tool from Vercel. Focuses on generating beautiful UIs and frontend components. Works with Figma imports and allows element-level editing. Best for UI-first web projects.",
    pricing: "Free tier, Pro and Enterprise available",
    votes: 4500,
    rating: null,
    ratingSource: null,
    tags: ["UI Generation", "Figma Integration", "Frontend"],
    imageUrl: "https://vibecoding.app/_next/image?url=%2Flogos%2Fv0-vercel.ico&w=3840&q=75",
    link: "https://vibecoding.app/tools/v0-vercel"
  },
  {
    id: 8,
    name: "Bolt.new",
    category: "Cloud Platforms & Prototyping",
    description: "Part of StackBlitz ecosystem. AI-driven full-stack builder with Supabase integration. Raised $105M in funding. Works for coders, nocoders, and marketers to spin up web apps quickly.",
    pricing: "Free tier available, Team & Enterprise plans",
    votes: 4000,
    rating: null,
    ratingSource: null,
    tags: ["Full-Stack", "Supabase Integration", "StackBlitz"],
    imageUrl: "https://vibecoding.app/_next/image?url=%2Flogos%2Fbolt-new.ico&w=3840&q=75",
    link: "https://vibecoding.app/tools/bolt-new"
  }
];

export const categories = [
  { id: "all", name: "全部工具", count: 62, emoji: "🎯" },
  { id: "website", name: "网站与商业工具", count: 7, emoji: "💼" },
  { id: "vibe", name: "Vibe & 无代码构建器", count: 20, emoji: "✨" },
  { id: "ide", name: "开发者 IDE & 代理", count: 13, emoji: "🚀" },
  { id: "assistant", name: "AI 助手 & 代码审查", count: 12, emoji: "🤖" },
  { id: "cloud", name: "云平台 & 原型设计", count: 8, emoji: "🛠️" },
  { id: "productivity", name: "工作流 & 生产力", count: 2, emoji: "📱" }
];
