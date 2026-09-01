import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import WorkflowSection from '../components/landing/WorkflowSection'
import Footer from '../components/landing/Footer'

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white antialiased">
      <Navbar />
      <main>
        <Hero />
        <WorkflowSection />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
