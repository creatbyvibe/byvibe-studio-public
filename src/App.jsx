import { useState, useEffect } from 'react'
import './App.css'
import ToolsSection from './components/ToolsSection'

function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToTools = (e) => {
    e.preventDefault()
    const toolsSection = document.getElementById('tools')
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="app">
      <div className={`hero ${mounted ? 'fade-in' : ''}`}>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">byVibe.ai</span>
          </h1>
          <p className="hero-subtitle">
            分享我的 <span className="highlight">VibeCoding</span> 学习之旅
          </p>
          <p className="hero-description">
            用AI构建网站的全流程实践<br />
            记录每一次编码的灵感和趣事
          </p>
          
          <div className="hero-features">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>AI驱动开发</h3>
              <p>探索AI辅助编程的无限可能</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>学习分享</h3>
              <p>记录成长路上的每一个瞬间</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>实战项目</h3>
              <p>从想法到部署的完整流程</p>
            </div>
          </div>

          <div className="hero-cta">
            <a 
              href="#tools" 
              className="cta-button primary"
              onClick={scrollToTools}
            >
              探索工具
            </a>
            <a 
              href="https://github.com" 
              className="cta-button secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>

          <div className="hero-footer">
            <p>Built with ❤️ using VibeCoding</p>
            <p className="tech-stack">React + Vite + Cloudflare Pages</p>
          </div>
        </div>
      </div>

      <ToolsSection />

      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  )
}

export default App