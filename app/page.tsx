import Link from 'next/link';
import { BookOpen, Play, Users, Upload, Heart, Sparkles, Headphones, Globe, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation - Floating Glassmorphism */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl border border-white/20 shadow-lg shadow-emerald-900/5 rounded-2xl">
          <div className="flex items-center justify-between h-14 px-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
                <BookOpen className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                QuranID
              </span>
            </Link>
            
            <div className="flex items-center gap-3">
              <Link
                href="/app"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 font-medium text-sm"
              >
                Open App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium Gradient */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-slate-50 to-slate-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-emerald-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-full text-sm font-medium text-emerald-700 mb-8 shadow-sm">
            <Sparkles size={16} className="text-emerald-500" />
            <span>Free Quran Recitation Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
            Listen & Share
            <span className="block mt-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Quran Recitations
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover beautiful Quran recitations from renowned reciters and share your own 
            with the community. A platform built for Muslims, by Muslims.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Play size={20} fill="currentColor" />
              </div>
              Start Listening
            </Link>
            
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-300 font-semibold text-lg"
            >
              Explore Features
            </a>
          </div>

          {/* Preview Card */}
          <div className="mt-16 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-20" />
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-100 p-2">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Headphones className="text-emerald-400" size={24} />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">Al-Fatiha</div>
                    <div className="text-emerald-400 text-sm">Mishary Alafasy</div>
                  </div>
                  <div className="ml-auto">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Play size={20} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-sm w-10 text-right">0:00</span>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                  </div>
                  <span className="text-slate-400 text-sm w-10">0:45</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Glass Cards */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {[
              { value: '114', label: 'Surahs Available' },
              { value: '10+', label: 'Reciters' },
              { value: '100%', label: 'Free Forever' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 sm:p-8 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A complete platform for listening to and sharing Quran recitations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Play,
                title: 'Listen Anywhere',
                description: 'Access all 114 surahs with high-quality audio from renowned reciters. Listen online or on the go.',
              },
              {
                icon: Upload,
                title: 'Share Your Recitation',
                description: 'Upload your own Quran recitations and share them with the community. Inspire others with your voice.',
              },
              {
                icon: Users,
                title: 'Community Driven',
                description: 'Discover recitations from community members around the world. Support and encourage fellow Muslims.',
              },
            ].map((feature, i) => (
              <div 
                key={i}
                className="group bg-slate-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-300 border border-transparent hover:border-slate-100"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="text-white" size={28} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              How It Works
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Get Started in 3 Steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Select a Surah', desc: 'Browse all 114 surahs and select the one you want to listen to' },
              { step: '2', title: 'Choose Reciter', desc: 'Pick from famous reciters or community-uploaded recitations' },
              { step: '3', title: 'Listen \u0026 Enjoy', desc: 'Immerse yourself in beautiful Quran recitations' },
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden sm:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald-200 to-emerald-100" />
                )}
                <div className="relative text-center">
                  <div className="w-16 h-16 bg-white border-2 border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-sm">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Globe, label: 'Available Worldwide' },
              { icon: Shield, label: 'Safe \u0026 Secure' },
              { icon: Heart, label: 'Made with Love' },
              { icon: Users, label: 'Growing Community' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <badge.icon className="text-emerald-600" size={24} />
                </div>
                <span className="text-slate-700 font-medium text-sm">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Start Listening?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            Join thousands of Muslims who use QuranID to listen and share Quran recitations daily.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 font-bold text-lg group"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Play size={24} fill="currentColor" />
            </div>
            Launch App Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-white">QuranID</span>
            </Link>
            
            <p className="text-sm">
              Made with <Heart className="inline w-4 h-4 text-red-500 fill-current" /> for the Ummah
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <Link href="/app" className="hover:text-white transition-colors">
                Open App
              </Link>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} QuranID. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
