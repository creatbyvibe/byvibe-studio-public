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

    // 获取当前用户
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn('Failed to get session:', error);
      }
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.warn('Error getting session:', error);
      setLoading(false);
    });

    // 监听认证状态变化
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          // 忽略取消订阅错误
        }
      };
    } catch (error) {
      console.warn('Error setting up auth state listener:', error);
      setLoading(false);
    }
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
