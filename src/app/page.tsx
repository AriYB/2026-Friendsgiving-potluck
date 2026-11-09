'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import EventDetails from '@/components/EventDetails';
import RsvpSection from '@/components/RsvpSection';
import PotluckSection from '@/components/PotluckSection';
import AllergySummary from '@/components/AllergySummary';
import { Heart, Github, Coffee } from 'lucide-react';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRsvpAdded = () => {
    // Increment to trigger AllergySummary re-fetch
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-autumn-50/20">
      {/* Top Notice Bar */}
      <div className="bg-autumn-800 text-autumn-100 py-2 px-4 text-center text-xs font-medium tracking-wide">
        🍁 Friendsgiving 2026 • RSVP and dish sign-ups are officially open!
      </div>

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Event Schedule & FAQs */}
        <EventDetails />

        {/* RSVP Section */}
        <RsvpSection onRsvpAdded={handleRsvpAdded} />

        {/* Potluck Coordination Board */}
        <PotluckSection />

        {/* Allergy & Dietary Summary */}
        <AllergySummary refreshKey={refreshKey} />
      </main>

      {/* Footer */}
      <footer className="bg-autumn-950 text-autumn-200 py-10 border-t border-autumn-900 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-serif text-lg font-bold text-autumn-100 flex items-center justify-center gap-2">
            <span>Friendsgiving 2026</span>
            <span className="text-autumn-500">•</span>
            <Heart className="w-4 h-4 text-cranberry-500 fill-cranberry-500" />
          </p>
          <p className="text-xs text-autumn-400 mt-2 max-w-md mx-auto">
            Organized with love for our circle of friends. Hosted on Vercel and backed by Supabase.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-autumn-400">
            <a
              href="#rsvp-section"
              className="hover:text-autumn-100 transition underline underline-offset-4"
            >
              RSVP
            </a>
            <span>•</span>
            <a
              href="#potluck-section"
              className="hover:text-autumn-100 transition underline underline-offset-4"
            >
              Potluck Sign-Up
            </a>
            <span>•</span>
            <a
              href="#allergies-section"
              className="hover:text-autumn-100 transition underline underline-offset-4"
            >
              Dietary Info
            </a>
          </div>
          <p className="text-[11px] text-autumn-600 mt-6">
            &copy; 2026 Friendsgiving Potluck. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
