'use client';

export default function Footer() {
  return (
    <footer className="bg-background text-text-dim py-10 md:py-12 px-6 mt-auto border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter text-white">
            byvibe<span className="text-gray-500 font-normal">.ai</span>
          </span>
          <span className="px-1.5 py-0.5 border border-border rounded text-[10px]">BETA</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-white transition-colors">
            GitHub
          </a>
          <a href="mailto:make@byvibe.ai" className="hover:text-white transition-colors">
            make@byvibe.ai
          </a>
        </div>
        <div className="font-mono">© 2026 ByVibe. All rights reserved.</div>
      </div>
    </footer>
  );
}
