'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const USAGE_KEY = 'byvibe_usage_count';
const MAX_FREE_USAGE = 1;

export function useUsageLimit() {
  const { user } = useAuth();
  const [usageCount, setUsageCount] = useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  useEffect(() => {
    // 如果已登录，不限制使用
    if (user) {
      setHasReachedLimit(false);
      return;
    }

    // 检查本地存储的使用次数
    const stored = localStorage.getItem(USAGE_KEY);
    const count = stored ? parseInt(stored, 10) : 0;
    setUsageCount(count);
    setHasReachedLimit(count >= MAX_FREE_USAGE);
  }, [user]);

  const incrementUsage = () => {
    if (user) return; // 已登录用户不限制

    const newCount = usageCount + 1;
    localStorage.setItem(USAGE_KEY, newCount.toString());
    setUsageCount(newCount);
    setHasReachedLimit(newCount >= MAX_FREE_USAGE);
  };

  const resetUsage = () => {
    localStorage.removeItem(USAGE_KEY);
    setUsageCount(0);
    setHasReachedLimit(false);
  };

  return {
    usageCount,
    hasReachedLimit,
    remainingUsage: Math.max(0, MAX_FREE_USAGE - usageCount),
    incrementUsage,
    resetUsage,
  };
}
