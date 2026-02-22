"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e:any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fixed particles - using useMemo to generate once on client
  const particles = mounted ? Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: (i * 7) % 100, // Deterministic positions
    y: (i * 13) % 100,
    size: (i % 3) + 2,
    duration: ((i % 5) + 3) * 2,
    delay: (i % 4) * 0.5,
  })) : [];

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Interactive gradient background - only show after mount */}
      {mounted && (
        <div 
          className="fixed inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 25%, rgba(236, 72, 153, 0.15) 50%, transparent 80%)`,
          }}
        />
      )}

      {/* Static grid background - safe for SSR */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Floating particles - only render after mount */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-white/20"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animation: `float ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Static wave background - safe for SSR */}
      <div className="fixed bottom-0 left-0 right-0 h-64 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-transparent" />
        <svg className="absolute bottom-0 w-full h-32" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <path 
            fill="rgba(139, 92, 246, 0.2)" 
            fillOpacity="1" 
            d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,202.7C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Main content */}
      <main className="relative z-10">
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
          {/* Glass morphism card - safe for SSR */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[800px] bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse-slow" />
          </div>

          <div
            className={`relative max-w-6xl mx-auto text-center transition-all duration-1000 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Animated badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm text-white/80">✨ Now with AI Assistant</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Organize Your Life
              </span>
              <span className="relative inline-block mt-4">
                <span className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                  Effortlessly
                </span>
                <span className="absolute -inset-1 bg-white/10 blur-xl rounded-full -z-10 animate-pulse" />
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              The smart todo app that understands natural language. 
              <span className="block mt-2 text-transparent bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text">
                Chat with AI to manage tasks, set priorities, and boost your productivity.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <Link
                href="/login"
                className="group relative px-10 py-5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              </Link>

              <Link
                href="/signup"
                className="group relative px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white font-bold text-lg transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:scale-105 w-full sm:w-auto overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { value: "10K+", label: "Active Users", icon: "👥" },
                { value: "1M+", label: "Tasks Completed", icon: "✅" },
                { value: "99%", label: "Satisfaction", icon: "⭐" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all duration-500" />
                  <div className="relative">
                    <span className="text-3xl mb-2 block">{stat.icon}</span>
                    <div className="text-4xl md:text-5xl font-black text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-white/60 text-sm md:text-base">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll indicator - only show after mount */}
            {mounted && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                  <div className="w-1 h-2 bg-white/60 rounded-full animate-[scroll_1.5s_ease-in-out_infinite]" />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(15px); opacity: 0; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}