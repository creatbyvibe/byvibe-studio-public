import { Suspense } from 'react';
import VerifyClient from './VerifyClient';

export default function VerifyPage() {
  // Next.js: useSearchParams 必须放在 Client 组件，并由 Suspense 包裹（否则静态预渲染会失败）
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="max-w-md w-full bg-surface border border-border rounded-lg p-8 shadow-2xl text-center">
            <div className="text-text-muted">Loading...</div>
          </div>
        </div>
      }
    >
      <VerifyClient />
    </Suspense>
  );
}
