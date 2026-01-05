import HeroSection from '@/components/HeroSection'
import BuildLog from '@/components/landing/BuildLog'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - 新的极简科技风设计 */}
      <HeroSection />
      
      {/* BuildLog 区域 - 保留原有的 Building in Public 时间轴 */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <BuildLog />
        </div>
      </section>
    </main>
  )
}
