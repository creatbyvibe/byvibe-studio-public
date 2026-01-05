/**
 * 图标工具函数
 * 统一处理图标获取和渲染，确保图标正确显示
 */

import * as LucideIcons from 'lucide-react';
import { ComponentType } from 'react';

// 图标名称映射表（处理命名不一致的情况）
const iconNameMap: Record<string, string> = {
  // 基础图标
  'code-2': 'Code2',
  'code': 'Code',
  'layout': 'Layout',
  'wind': 'Wind',
  'bot': 'Bot',
  'sparkles': 'Sparkles',
  'cloud': 'Cloud',
  'heart': 'Heart',
  'bolt': 'Bolt',
  'zap': 'Zap',
  'cpu': 'Cpu',
  'network': 'Network',
  'image': 'Image',
  'database': 'Database',
  'terminal': 'Terminal',
  'file-code': 'FileCode',
  'shield': 'Shield',
  'globe': 'Globe',
  'git-branch': 'GitBranch',
  'github': 'Github',
  'brain': 'Brain',
  'package': 'Package',
  'search': 'Search',
  'play': 'Play',
};

/**
 * 获取图标组件
 * @param iconName - 图标名称（可能是 kebab-case 或 PascalCase）
 * @returns 图标组件，如果找不到则返回 Code 图标
 */
export function getIconComponent(iconName: string): ComponentType<any> {
  if (!iconName) {
    return LucideIcons.Code;
  }

  // 首先检查映射表
  const mappedName = iconNameMap[iconName.toLowerCase()];
  if (mappedName) {
    const IconComponent = (LucideIcons as any)[mappedName];
    if (IconComponent) {
      return IconComponent;
    }
  }

  // 尝试直接使用原始名称（PascalCase）
  const PascalCaseName = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  
  const DirectIcon = (LucideIcons as any)[PascalCaseName];
  if (DirectIcon) {
    return DirectIcon;
  }

  // 尝试原始名称（如果已经是 PascalCase）
  const OriginalIcon = (LucideIcons as any)[iconName];
  if (OriginalIcon) {
    return OriginalIcon;
  }

  // 默认返回 Code 图标
  console.warn(`Icon "${iconName}" not found, using Code as fallback`);
  return LucideIcons.Code;
}

/**
 * 验证图标是否存在
 * @param iconName - 图标名称
 * @returns 是否存在
 */
export function isValidIcon(iconName: string): boolean {
  if (!iconName) return false;
  
  const IconComponent = getIconComponent(iconName);
  return IconComponent !== LucideIcons.Code || iconName.toLowerCase() === 'code';
}
