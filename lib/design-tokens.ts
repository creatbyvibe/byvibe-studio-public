/**
 * ByVibe Design System Tokens
 * 设计系统令牌 - 统一的设计语言规范
 * 
 * 参考优秀案例：
 * - Vercel Design System
 * - Linear Design System
 * - Stripe Design System
 * - GitHub Primer
 */

export const designTokens = {
  // ========== 字体系统 ==========
  typography: {
    // 字体族
    fontFamily: {
      sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
    },
    
    // 字体大小（基于 16px 基准，使用 rem）
    fontSize: {
      // 品牌 Slogan（主品牌）
      brandSlogan: {
        mobile: '0.875rem',    // 14px
        desktop: '1rem',       // 16px
      },
      // 产品 Slogan（产品标题）
      productSlogan: {
        mobile: '2.5rem',      // 40px
        tablet: '3.5rem',      // 56px
        desktop: '4.5rem',     // 72px
        large: '5.5rem',       // 88px
      },
      // 标题层级
      h1: {
        mobile: '2rem',        // 32px
        desktop: '2.5rem',     // 40px
      },
      h2: {
        mobile: '1.5rem',      // 24px
        desktop: '2rem',       // 32px
      },
      h3: {
        mobile: '1.25rem',     // 20px
        desktop: '1.5rem',     // 24px
      },
      h4: {
        mobile: '1.125rem',    // 18px
        desktop: '1.25rem',    // 20px
      },
      // 正文
      body: {
        mobile: '0.875rem',    // 14px
        desktop: '1rem',       // 16px
      },
      bodyLarge: {
        mobile: '1rem',        // 16px
        desktop: '1.125rem',   // 18px
      },
      // 小字
      small: {
        mobile: '0.75rem',     // 12px
        desktop: '0.875rem',   // 14px
      },
      tiny: {
        mobile: '0.625rem',    // 10px
        desktop: '0.75rem',    // 12px
      },
    },
    
    // 字重
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    
    // 行高
    lineHeight: {
      tight: 1.1,      // 标题
      normal: 1.5,     // 正文
      relaxed: 1.75,  // 长文本
    },
    
    // 字间距
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',  // 用于大写字母
    },
  },

  // ========== 间距系统 ==========
  spacing: {
    // 基础间距单位（4px 基准）
    base: 4,
    // 间距值
    xs: '0.5rem',      // 8px
    sm: '0.75rem',     // 12px
    md: '1rem',        // 16px
    lg: '1.5rem',      // 24px
    xl: '2rem',        // 32px
    '2xl': '3rem',     // 48px
    '3xl': '4rem',     // 64px
    '4xl': '6rem',     // 96px
  },

  // ========== 圆角系统 ==========
  borderRadius: {
    none: '0',
    sm: '0.25rem',      // 4px
    md: '0.375rem',     // 6px
    lg: '0.5rem',       // 8px
    xl: '0.75rem',      // 12px
    '2xl': '1rem',      // 16px
    full: '9999px',
  },

  // ========== 卡片系统 ==========
  card: {
    // 卡片尺寸
    size: {
      sm: {
        padding: '1rem',        // 16px
        minHeight: '120px',
      },
      md: {
        padding: '1.5rem',     // 24px
        minHeight: '160px',
      },
      lg: {
        padding: '2rem',        // 32px
        minHeight: '200px',
      },
    },
    // 卡片圆角
    borderRadius: '0.5rem',    // 8px
    // 卡片边框
    border: {
      width: '1px',
      color: 'rgba(255, 255, 255, 0.1)',
    },
    // 卡片背景
    background: {
      default: 'rgba(15, 15, 15, 0.5)',
      hover: 'rgba(15, 15, 15, 0.8)',
    },
  },

  // ========== 按钮系统 ==========
  button: {
    // 按钮尺寸
    size: {
      sm: {
        padding: '0.5rem 1rem',      // 8px 16px
        fontSize: '0.875rem',        // 14px
        height: '2rem',              // 32px
      },
      md: {
        padding: '0.75rem 1.5rem',   // 12px 24px
        fontSize: '1rem',            // 16px
        height: '2.5rem',            // 40px
      },
      lg: {
        padding: '1rem 2rem',         // 16px 32px
        fontSize: '1.125rem',        // 18px
        height: '3rem',              // 48px
      },
    },
    // 按钮圆角
    borderRadius: '0.375rem',        // 6px
  },

  // ========== 输入框系统 ==========
  input: {
    // 输入框尺寸
    size: {
      sm: {
        padding: '0.5rem 0.75rem',    // 8px 12px
        fontSize: '0.875rem',        // 14px
        height: '2rem',              // 32px
      },
      md: {
        padding: '0.75rem 1rem',     // 12px 16px
        fontSize: '1rem',            // 16px
        height: '2.5rem',            // 40px
      },
      lg: {
        padding: '1rem 1.25rem',     // 16px 20px
        fontSize: '1.125rem',        // 18px
        height: '3rem',              // 48px
      },
    },
    // 输入框圆角
    borderRadius: '0.375rem',        // 6px
  },

  // ========== 图标系统 ==========
  icon: {
    size: {
      xs: '0.75rem',     // 12px
      sm: '1rem',        // 16px
      md: '1.25rem',     // 20px
      lg: '1.5rem',      // 24px
      xl: '2rem',        // 32px
    },
  },

  // ========== 容器系统 ==========
  container: {
    // 最大宽度
    maxWidth: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',  // 96rem
    },
    // 内边距
    padding: {
      mobile: '1rem',    // 16px
      tablet: '1.5rem', // 24px
      desktop: '2rem',  // 32px
    },
  },

  // ========== 断点系统 ==========
  breakpoint: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ========== 阴影系统 ==========
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // ========== 过渡动画 ==========
  transition: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
} as const;

// 导出类型
export type DesignTokens = typeof designTokens;
