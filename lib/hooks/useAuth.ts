'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 如果 Supabase 未配置，直接返回
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    let subscription: any = null;

    // 设置超时，避免无限 loading
    const timeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Auth loading timeout, forcing stop');
        setLoading(false);
      }
    }, 5000); // 5秒超时

    // 获取当前用户
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!isMounted) return;
      
      if (error) {
        console.warn('Failed to get session:', error);
      }
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      if (!isMounted) return;
      console.warn('Error getting session:', error);
      setLoading(false);
    });

    // 监听认证状态变化
    try {
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!isMounted) return;
        setUser(session?.user ?? null);
        setLoading(false);
      });
      subscription = sub;
    } catch (error) {
      console.warn('Error setting up auth state listener:', error);
      setLoading(false);
    }

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          // 忽略取消订阅错误
        }
      }
    };
  }, []);

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      return;
    }
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.warn('Error signing out:', error);
      setUser(null);
    }
  };

  return { user, loading, signOut };
}
