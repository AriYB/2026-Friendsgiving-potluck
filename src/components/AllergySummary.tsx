'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RSVP } from '@/lib/types';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, HeartHandshake } from 'lucide-react';

export default function AllergySummary({ refreshKey }: { refreshKey?: number }) {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDietaryInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('rsvps')
          .select('*')
          .eq('attendance', 'yes');

        if (error) throw error;
        setRsvps(data || []);
      } catch (err: unknown) {
        console.error('Error fetching allergy info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDietaryInfo();
  }, [refreshKey]);

  // Aggregate tags
  const tagCounts: Record<string, number> = {};
  const specificAllergies: { name: string; note: string }[] = [];

  rsvps.forEach(rsvp => {
    if (rsvp.dietary_tags) {
      rsvp.dietary_tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
    if (rsvp.allergies && rsvp.allergies.trim()) {
      specificAllergies.push({
        name: rsvp.name,
        note: rsvp.allergies.trim(),
      });
    }
  });

  const hasAnyRestrictions = Object.keys(tagCounts).length > 0 || specificAllergies.length > 0;

  return (
    <section id="allergies-section" className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-white via-autumn-50/40 to-harvest-50/30 rounded-3xl p-6 sm:p-10 border border-autumn-200/80 shadow-md">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cranberry-100 text-cranberry-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-cranberry-600" />
              <span>Food Safety &amp; Dietary Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-autumn-950 font-serif">
              Guest Allergies &amp; Dietary Restrictions
            </h2>
            <p className="mt-1 text-autumn-700/80 text-sm max-w-xl">
              Cooks and bakers: Please check this summary before preparing your dishes so everyone can eat safely!
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-autumn-200 text-autumn-800 shadow-sm self-start">
            <HeartHandshake className="w-4 h-4 text-autumn-600" />
            <span>Label your ingredients at the table!</span>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-autumn-500 text-sm">
            Reviewing dietary responses...
          </div>
        ) : !hasAnyRestrictions ? (
          <div className="p-6 rounded-2xl bg-white/80 border border-autumn-200 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-bold text-autumn-900 text-base">No Severe Allergies Reported Yet</h4>
            <p className="text-xs text-autumn-600 mt-1 max-w-md mx-auto">
              As guests submit their RSVPs, their dietary preferences and allergen warnings will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tag Counts */}
            {Object.keys(tagCounts).length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-autumn-700 mb-3 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Dietary Breakdown Across Attendees</span>
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {Object.entries(tagCounts).map(([tag, count]) => (
                    <div
                      key={tag}
                      className="px-3.5 py-2 rounded-xl bg-white border border-autumn-200/90 shadow-sm flex items-center gap-2"
                    >
                      <span className="font-bold text-autumn-950 text-sm">{tag}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cranberry-100 text-cranberry-800">
                        {count} {count === 1 ? 'person' : 'people'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Notes */}
            {specificAllergies.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-cranberry-800 mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-cranberry-600" />
                  <span>Specific Allergen Notes from Guests</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {specificAllergies.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-cranberry-50/70 border border-cranberry-200/80 text-sm"
                    >
                      <span className="font-bold text-cranberry-950 block text-xs uppercase tracking-wide">
                        {item.name} notes:
                      </span>
                      <p className="mt-1 text-cranberry-900 font-medium">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chef Tip */}
            <div className="p-4 rounded-xl bg-harvest-50 border border-harvest-200/80 text-xs text-harvest-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-harvest-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Helpful Tip for Guests Bringing Food:</p>
                <p className="mt-0.5 text-harvest-800">
                  We&apos;ll have small index cards and pens near the buffet so everyone can write a quick label (e.g. &ldquo;Dairy-free / Contains Pecans&rdquo;) next to their dish!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
