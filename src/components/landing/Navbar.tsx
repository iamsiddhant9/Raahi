import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, MapPin, Award } from 'lucide-react';

export default function Navbar({ credits, questsCompleted, onStartClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-signboard-dark/95 backdrop-blur-md py-3 shadow-xl border-b border-marigold/30'
          : 'bg-signboard-dark/40 backdrop-blur-xs py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="signboard-text text-2xl sm:text-3xl tracking-wide uppercase transition-transform group-hover:scale-105">
                RAAHI
              </span>
              <span className="text-marigold font-heading font-extrabold text-sm tracking-wider hidden sm:inline drop-shadow-sm">
                राही
              </span>
            </div>
            <span className="text-[11px] tracking-widest uppercase text-parchment font-bold -mt-0.5 hidden md:block">
              Har Gali Ek Kahani Hai
            </span>
          </div>
        </a>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-heading font-bold text-parchment">
          <a
            href="#story"
            className="hover:text-marigold transition-colors py-1 drop-shadow-sm"
          >
            Polaroids
          </a>
          <a
            href="#problem"
            className="hover:text-marigold transition-colors py-1 drop-shadow-sm"
          >
            Why RAAHI
          </a>
          <a
            href="#user-journey"
            className="hover:text-marigold transition-colors py-1 drop-shadow-sm text-marigold"
          >
            User Journey
          </a>
          <a
            href="#how-it-works"
            className="hover:text-marigold transition-colors py-1 drop-shadow-sm"
          >
            Quest Loop
          </a>
          <a
            href="#quests-demo"
            className="hover:text-marigold transition-colors py-1 drop-shadow-sm"
          >
            Live Demo
          </a>
          <a
            href="#stakeholders"
            className="hover:text-marigold transition-colors py-1 drop-shadow-sm"
          >
            Stakeholders
          </a>
          <a
            href="#tourism-board"
            className="hover:text-marigold transition-colors py-1 drop-shadow-sm"
          >
            City Intel
          </a>
        </nav>

        {/* Action / Credits Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live Credits Counter */}
          <div className="flex items-center gap-2 bg-signboard-navy/95 border-2 border-marigold/60 rounded-full px-3.5 py-1.5 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <Award className="w-4 h-4 text-marigold" />
            <span className="text-xs sm:text-sm font-extrabold text-marigold font-heading tracking-wide">
              {credits} <span className="text-[10px] uppercase font-bold tracking-wider text-parchment">RC</span>
            </span>
          </div>

          {/* Primary CTA */}
          <button
            onClick={onStartClick}
            className="bg-marigold hover:bg-amber-300 active:scale-95 text-signboard-navy font-heading font-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm shadow-signboard transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start My Journey</span>
            <Compass className="w-4 h-4 text-signboard-navy stroke-[2.5]" />
          </button>
        </div>
      </div>
    </header>
  );
}
