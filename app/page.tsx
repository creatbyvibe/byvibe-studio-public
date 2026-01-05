import HeroSection from '@/components/HeroSection'
import BuildLog from '@/components/landing/BuildLog'
import MakeTrust from '@/components/MakeTrust'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Clean tech design */}
      <HeroSection />
      
      {/* BuildLog 区域 - Building in Public timeline */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <BuildLog />
        </div>
      </section>

      {/* MakeTrust 区域 - Tools we use */}
      <MakeTrust />
    </main>
  )
}
