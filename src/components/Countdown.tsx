'use client';

import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const destination = new Date(targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = destination - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!isClient) {
    return (
      <div className="flex gap-3 justify-center items-center py-2">
        <div className="bg-white/80 backdrop-blur rounded-2xl px-4 py-3 shadow-sm border border-autumn-100 min-w-[70px] text-center">
          <span className="text-2xl font-bold text-autumn-800">--</span>
          <span className="block text-xs uppercase tracking-wider text-autumn-500 font-medium">Days</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2.5 sm:gap-4 justify-center items-center">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 shadow-md border border-autumn-200/60 min-w-[72px] sm:min-w-[85px] text-center">
        <span className="text-2xl sm:text-3xl font-extrabold text-autumn-800 font-serif">{timeLeft.days}</span>
        <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-autumn-600 font-semibold mt-0.5">Days</span>
      </div>
      <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 shadow-md border border-autumn-200/60 min-w-[72px] sm:min-w-[85px] text-center">
        <span className="text-2xl sm:text-3xl font-extrabold text-autumn-800 font-serif">{timeLeft.hours}</span>
        <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-autumn-600 font-semibold mt-0.5">Hours</span>
      </div>
      <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 shadow-md border border-autumn-200/60 min-w-[72px] sm:min-w-[85px] text-center">
        <span className="text-2xl sm:text-3xl font-extrabold text-autumn-800 font-serif">{timeLeft.minutes}</span>
        <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-autumn-600 font-semibold mt-0.5">Mins</span>
      </div>
      <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 shadow-md border border-autumn-200/60 min-w-[72px] sm:min-w-[85px] text-center">
        <span className="text-2xl sm:text-3xl font-extrabold text-autumn-700 font-serif">{timeLeft.seconds}</span>
        <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-autumn-600 font-semibold mt-0.5">Secs</span>
      </div>
    </div>
  );
}
