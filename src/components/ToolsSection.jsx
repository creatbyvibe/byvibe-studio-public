import { useState } from 'react';
import { tools, categories } from '../data/tools';
import './ToolsSection.css';

function ToolsSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getCategoryId = (categoryName) => {
    const categoryMap = {
      'Website & Business Tools': 'website',
      'Vibe / No-Code Builders': 'vibe',
      'Developer IDEs & Agents': 'ide',
      'AI Assistants & Code Review': 'assistant',
      'Cloud Platforms & Prototyping': 'cloud',
      'Workflow & Productivity': 'productivity'
    };
    return categoryMap[categoryName] || 'all';
  };

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => getCategoryId(tool.category) === selectedCategory);

  const renderStars = (rating) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="rating-stars">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <span key={i} className="star filled">★</span>;
          } else if (i === fullStars && hasHalfStar) {
            return <span key={i} className="star half">★</span>;
          } else {
            return <span key={i} className="star">★</span>;
          }
        })}
        <span className="rating-value">{rating}/5</span>
      </div>
    );
  };

  return (
    <section className="tools-section" id="tools">
      <div className="tools-container">
        <div className="tools-header">
          <div className="tools-header-content">
            <div className="tools-badge">
              <span className="badge-icon">✨</span>
              <span>最受欢迎的 Vibe Coding 工具</span>
            </div>
            <h2 className="tools-title">发现最佳 AI 编程工具</h2>
            <p className="tools-description">
              精心挑选的 62+ AI 驱动开发工具、编程助手和生产力增强工具，正在彻底改变开发者的工作方式。
            </p>
          </div>

          <div className="tools-filters">
            <h3 className="filters-title">分类</h3>
            <div className="category-buttons">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="category-emoji">{category.emoji}</span>
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="tools-count">
            <p>显示 {filteredTools.length} / {tools.length} 个工具</p>
          </div>
        </div>

        <div className="tools-grid">
          {filteredTools.map(tool => (
            <div key={tool.id} className={`tool-card ${tool.featured ? 'featured' : ''} ${tool.new ? 'new' : ''}`}>
              {tool.featured && <div className="tool-badge featured-badge">精选</div>}
              {tool.new && <div className="tool-badge new-badge">新!</div>}
              
              <div className="tool-image-container">
                {tool.imageUrl ? (
                  <img 
                    src={tool.imageUrl} 
                    alt={tool.name}
                    className="tool-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="tool-image-placeholder" style={{ display: tool.imageUrl ? 'none' : 'flex' }}>
                  <span className="tool-image-icon">🛠️</span>
                </div>
                <div className="tool-category-label">{tool.category}</div>
              </div>

              <div className="tool-content">
                <div className="tool-header">
                  <h3 className="tool-name">{tool.name}</h3>
                  <p className="tool-pricing">{tool.pricing}</p>
                </div>

                <div className="tool-stats">
                  <div className="tool-votes">
                    <span className="votes-icon">👍</span>
                    <span className="votes-count">{tool.votes.toLocaleString()}</span>
                    <span className="votes-label">票</span>
                  </div>
                </div>

                <p className="tool-description">{tool.description}</p>

                {tool.rating && (
                  <div className="tool-rating">
                    {renderStars(tool.rating)}
                    {tool.ratingSource && (
                      <a 
                        href={`https://www.trustpilot.com`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="rating-source"
                      >
                        {tool.ratingSource}
                      </a>
                    )}
                  </div>
                )}

                <div className="tool-tags">
                  {tool.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="tool-tag">
                      {tag}
                    </span>
                  ))}
                  {tool.tags.length > 3 && (
                    <span className="tool-tag more">+{tool.tags.length - 3}</span>
                  )}
                </div>

                <a 
                  href={tool.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="tool-link"
                >
                  了解更多 →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="tools-stats">
          <div className="stat-item">
            <div className="stat-icon">📊</div>
            <h3 className="stat-number">62+</h3>
            <p className="stat-label">AI 工具已评测</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <h3 className="stat-number">50K+</h3>
            <p className="stat-label">开发者信任我们</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🔄</div>
            <h3 className="stat-number">每日</h3>
            <p className="stat-label">更新评测</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ToolsSection;
