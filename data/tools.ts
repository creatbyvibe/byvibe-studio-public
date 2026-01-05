export interface Tool {
  id: number;
  name: string;
  category: string;
  icon: string;
  desc: string;
  bestFor: string;
  link: string;
}

export const toolsData: Tool[] = [
  { 
    id: 1, 
    name: "Cursor", 
    category: "AI IDE", 
    icon: "code-2", 
    desc: "The AI-first code editor. ByVibe generates `.cursorrules` to keep context clean.", 
    bestFor: "Full-stack AI Dev", 
    link: "https://cursor.sh" 
  },
  { 
    id: 2, 
    name: "v0.dev", 
    category: "AI UI", 
    icon: "layout", 
    desc: "Vercel's generative UI system. ByVibe provides structural prompts for Shadcn components.", 
    bestFor: "AI Prototyping", 
    link: "https://v0.dev" 
  },
  { 
    id: 3, 
    name: "Windsurf", 
    category: "AI IDE", 
    icon: "wind", 
    desc: "Flow-state editor by Codeium. ByVibe feeds it architecture diagrams.", 
    bestFor: "Deep AI Context", 
    link: "https://codeium.com/windsurf" 
  },
  { 
    id: 4, 
    name: "Manus", 
    category: "AI Agent", 
    icon: "bot", 
    desc: "Autonomous AI agent for executing complex coding tasks. ByVibe provides the master plan.", 
    bestFor: "Autonomous Dev", 
    link: "https://manus.ai" 
  },
  { 
    id: 5, 
    name: "Gemini 3.0", 
    category: "AI Model", 
    icon: "sparkles", 
    desc: "Google's next-gen multimodal model. Excellent for ingesting ByVibe's massive AI PRDs.", 
    bestFor: "Vibe Reasoning", 
    link: "https://deepmind.google/technologies/gemini/" 
  },
  { 
    id: 6, 
    name: "Cloudflare", 
    category: "AI Infra", 
    icon: "cloud", 
    desc: "Edge AI and Worker platform. ByVibe generates deployment configurations.", 
    bestFor: "AI Deployment", 
    link: "https://cloudflare.com" 
  },
  { 
    id: 7, 
    name: "Lovable", 
    category: "AI No-Code", 
    icon: "heart", 
    desc: "Generate full-stack web apps from text. ByVibe refines the initial Vibe spec.", 
    bestFor: "MVP building", 
    link: "https://lovable.dev" 
  },
  { 
    id: 8, 
    name: "Bolt.new", 
    category: "AI Web Container", 
    icon: "zap", 
    desc: "Browser-based environment. ByVibe sets up the initial file tree.", 
    bestFor: "Quick Demos", 
    link: "https://bolt.new" 
  },
];
