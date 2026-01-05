import Waitlist from '@/components/landing/Waitlist'
import BuildLog from '@/components/landing/BuildLog'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* 网格纹理背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-vibe-purple/5 via-transparent to-transparent pointer-events-none" />

      {/* 主内容区域 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-4xl mx-auto space-y-16">
          {/* Hero 区域 */}
          <section className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Coding at the Speed of{' '}
              <span className="bg-gradient-to-r from-vibe-purple via-vibe-purple-light to-vibe-purple bg-clip-text text-transparent">
                Vibe.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
              Building the world's first Full-Cycle AI Dev Studio in public.
            </p>
          </section>

          {/* Waitlist 区域 */}
          <section className="flex justify-center">
            <Waitlist />
          </section>

          {/* BuildLog 区域 */}
          <section className="pt-8">
            <BuildLog />
          </section>
        </div>
      </div>
    </main>
  )
}
