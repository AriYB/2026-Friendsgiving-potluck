'use client';

import Countdown from './Countdown';
import { Calendar, MapPin, Clock, UtensilsCrossed, Sparkles } from 'lucide-react';

export default function Hero() {
  // Friendsgiving 2026: Saturday, November 21, 2026 at 5:00 PM EST
  const eventDate = '2026-11-21T17:00:00';

  return (
    <header className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-autumn-100/70 via-harvest-50/50 to-autumn-50/30 border-b border-autumn-200/50">
      {/* Decorative Autumn Leaves & Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden select-none opacity-40">
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-autumn-300/30 blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-harvest-300/25 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-10 left-1/4 w-72 h-72 rounded-full bg-cranberry-300/20 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-autumn-100 border border-autumn-200 text-autumn-800 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-sm mb-6">
          <Sparkles className="w-3.5 h-3.5 text-autumn-600 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Annual Celebration</span>
          <span className="text-autumn-400">•</span>
          <span>Friends & Good Food</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-autumn-950 font-serif tracking-tight leading-tight">
          Friendsgiving <span className="text-transparent bg-clip-text bg-gradient-to-r from-autumn-700 via-autumn-600 to-harvest-600">2026</span>
        </h1>

        <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-autumn-900/80 max-w-2xl mx-auto font-medium leading-relaxed">
          Grateful hearts, cozy sweaters, and full plates. We can&apos;t wait to celebrate friendship and good food together!
        </p>

        {/* Event Key Details Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto text-left">
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-autumn-200/70 shadow-sm flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-autumn-500/10 text-autumn-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-autumn-500 tracking-wider">Date</p>
              <p className="font-semibold text-autumn-950 text-sm sm:text-base">Sat, Nov 21, 2026</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-autumn-200/70 shadow-sm flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-harvest-500/10 text-harvest-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-autumn-500 tracking-wider">Time</p>
              <p className="font-semibold text-autumn-950 text-sm sm:text-base">5:00 PM EST</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-autumn-200/70 shadow-sm flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-sage-500/10 text-sage-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-autumn-500 tracking-wider">Location</p>
              <p className="font-semibold text-autumn-950 text-sm sm:text-base">Ari&apos;s Place</p>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="mt-8 sm:mt-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-autumn-600 mb-3">Countdown to Feast</p>
          <Countdown targetDate={eventDate} />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
          <a
            href="#rsvp-section"
            className="px-6 py-3.5 rounded-xl bg-autumn-600 hover:bg-autumn-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>RSVP Now</span>
            <span className="text-autumn-200">→</span>
          </a>
          <a
            href="#potluck-section"
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-autumn-50/80 text-autumn-800 font-semibold border border-autumn-300/80 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4 text-autumn-600" />
            <span>Potluck Sign-Up</span>
          </a>
          <a
            href="#allergies-section"
            className="px-4 py-3.5 rounded-xl text-autumn-700 hover:text-autumn-900 font-medium text-sm transition"
          >
            Dietary &amp; Allergies
          </a>
        </div>
      </div>
    </header>
  );
}
