'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RSVP, COMMON_DIETARY_TAGS, AttendanceStatus } from '@/lib/types';
import confetti from 'canvas-confetti';
import { 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  Heart, 
  AlertTriangle, 
  Sparkles,
  Send,
  Loader2,
  Trash2
} from 'lucide-react';

export default function RsvpSection({ onRsvpAdded }: { onRsvpAdded?: () => void }) {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<AttendanceStatus>('yes');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allergiesText, setAllergiesText] = useState('');
  const [notes, setNotes] = useState('');

  const fetchRsvps = async () => {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRsvps(data || []);
    } catch (err: unknown) {
      console.error('Error fetching RSVPs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRsvps();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error } = await supabase.from('rsvps').insert([
        {
          name: name.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          attendance,
          guest_count: attendance === 'no' ? 0 : guestCount,
          allergies: allergiesText.trim(),
          dietary_tags: selectedTags,
          notes: notes.trim(),
        },
      ]);

      if (error) throw error;

      // Trigger confetti celebration if attending!
      if (attendance === 'yes') {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ce6c42', '#ca8a04', '#df4e6c', '#5e8461'],
          });
        } catch {
          // ignore confetti errors in non-browser envs
        }
      }

      setSuccessMessage('Thank you! Your RSVP has been saved.');
      setName('');
      setEmail('');
      setPhone('');
      setAttendance('yes');
      setGuestCount(1);
      setSelectedTags([]);
      setAllergiesText('');
      setNotes('');

      await fetchRsvps();
      if (onRsvpAdded) onRsvpAdded();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save RSVP. Please try again.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, rsvpName: string) => {
    if (!confirm(`Are you sure you want to remove the RSVP for ${rsvpName}?`)) return;

    try {
      const { error } = await supabase.from('rsvps').delete().eq('id', id);
      if (error) throw error;
      setRsvps(prev => prev.filter(r => r.id !== id));
      if (onRsvpAdded) onRsvpAdded();
    } catch (err: unknown) {
      console.error('Error deleting RSVP:', err);
    }
  };

  // Stats calculation
  const attendingCount = rsvps
    .filter(r => r.attendance === 'yes')
    .reduce((sum, r) => sum + (r.guest_count || 1), 0);
  const yesResponses = rsvps.filter(r => r.attendance === 'yes').length;
  const maybeResponses = rsvps.filter(r => r.attendance === 'maybe').length;

  return (
    <section id="rsvp-section" className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-autumn-100/80 text-autumn-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <Heart className="w-3.5 h-3.5 text-cranberry-600 fill-cranberry-600" />
          <span>Save Your Seat</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-autumn-950 font-serif">
          RSVP for Friendsgiving
        </h2>
        <p className="mt-2 text-autumn-800/80 text-sm sm:text-base max-w-xl mx-auto">
          Let us know if you can join our feast! Please include any dietary needs so everyone enjoys the meal safely.
        </p>

        {/* Quick Stats Pill */}
        <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-4 py-2.5 px-5 rounded-2xl bg-white border border-autumn-200/80 shadow-sm text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-bold text-autumn-950">{attendingCount}</span>
            <span className="text-autumn-600">Total Attending ({yesResponses} parties)</span>
          </div>
          {maybeResponses > 0 && (
            <div className="flex items-center gap-1.5 text-autumn-700">
              <span className="text-autumn-400">•</span>
              <span className="font-semibold">{maybeResponses}</span>
              <span className="text-autumn-500">Maybe</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* RSVP Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-autumn-200/80 shadow-md">
          <h3 className="text-xl font-bold text-autumn-950 font-serif mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-autumn-600" />
            <span>Your Response</span>
          </h3>

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{successMessage}</p>
                <p className="text-xs text-green-700 mt-0.5">Don&apos;t forget to sign up for a dish in the potluck section below!</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-autumn-700 mb-1.5">
                Your Name <span className="text-cranberry-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full px-4 py-2.5 rounded-xl border border-autumn-200 focus:outline-none focus:ring-2 focus:ring-autumn-500/50 focus:border-autumn-500 text-autumn-950 placeholder-autumn-300 transition"
              />
            </div>

            {/* Attendance Choice Buttons */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-autumn-700 mb-1.5">
                Will you be attending? <span className="text-cranberry-600">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAttendance('yes')}
                  className={`py-2.5 px-3 rounded-xl border font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
                    attendance === 'yes'
                      ? 'bg-autumn-600 text-white border-autumn-600 shadow-sm'
                      : 'bg-autumn-50/50 text-autumn-800 border-autumn-200 hover:bg-autumn-100/70'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Yes, I&apos;ll be there!</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance('maybe')}
                  className={`py-2.5 px-3 rounded-xl border font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
                    attendance === 'maybe'
                      ? 'bg-harvest-600 text-white border-harvest-600 shadow-sm'
                      : 'bg-autumn-50/50 text-autumn-800 border-autumn-200 hover:bg-autumn-100/70'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Maybe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance('no')}
                  className={`py-2.5 px-3 rounded-xl border font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
                    attendance === 'no'
                      ? 'bg-gray-600 text-white border-gray-600 shadow-sm'
                      : 'bg-autumn-50/50 text-autumn-800 border-autumn-200 hover:bg-autumn-100/70'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  <span>Can&apos;t Make It</span>
                </button>
              </div>
            </div>

            {/* Guest Count */}
            {attendance !== 'no' && (
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-autumn-700 mb-1.5">
                  Total Guests in Your Party (including yourself)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={guestCount}
                    onChange={e => setGuestCount(parseInt(e.target.value) || 1)}
                    className="w-full accent-autumn-600 cursor-pointer"
                  />
                  <span className="w-10 text-center font-bold text-lg text-autumn-800 bg-autumn-100 py-1 px-2.5 rounded-lg border border-autumn-200">
                    {guestCount}
                  </span>
                </div>
              </div>
            )}

            {/* Contact Info (Email & Phone) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-autumn-700 mb-1.5">
                  Email (Optional, for reminders)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="maya@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-autumn-200 focus:outline-none focus:ring-2 focus:ring-autumn-500/50 focus:border-autumn-500 text-autumn-950 placeholder-autumn-300 transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-autumn-700 mb-1.5">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full px-4 py-2.5 rounded-xl border border-autumn-200 focus:outline-none focus:ring-2 focus:ring-autumn-500/50 focus:border-autumn-500 text-autumn-950 placeholder-autumn-300 transition text-sm"
                />
              </div>
            </div>

            {/* Dietary Restrictions & Allergies */}
            <div className="pt-2 border-t border-autumn-100">
              <label className="block text-xs uppercase font-bold tracking-wider text-autumn-800 mb-1">
                Dietary Restrictions &amp; Allergies
              </label>
              <p className="text-xs text-autumn-600 mb-2.5">
                Select any that apply to you or your guests so cooks can plan safely:
              </p>
              
              {/* Common Tags Multi-Select */}
              <div className="flex flex-wrap gap-2 mb-3">
                {COMMON_DIETARY_TAGS.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                        isSelected
                          ? 'bg-cranberry-700 text-white border-cranberry-700 shadow-sm'
                          : 'bg-autumn-50/60 text-autumn-800 border-autumn-200 hover:bg-autumn-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Specific allergy details input */}
              <input
                type="text"
                value={allergiesText}
                onChange={e => setAllergiesText(e.target.value)}
                placeholder="Specific allergy details (e.g. severe peanut allergy, anaphylactic, celiac disease...)"
                className="w-full px-4 py-2.5 rounded-xl border border-autumn-200 focus:outline-none focus:ring-2 focus:ring-cranberry-500/50 focus:border-cranberry-500 text-autumn-950 placeholder-autumn-300 transition text-sm"
              />
            </div>

            {/* Note for Host */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-autumn-700 mb-1.5">
                A Note for the Host (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Can't wait! Bringing games or a playlist..."
                className="w-full px-4 py-2.5 rounded-xl border border-autumn-200 focus:outline-none focus:ring-2 focus:ring-autumn-500/50 focus:border-autumn-500 text-autumn-950 placeholder-autumn-300 transition text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl bg-autumn-600 hover:bg-autumn-700 active:bg-autumn-800 text-white font-semibold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving your RSVP...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit RSVP</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Guest List Preview */}
        <div className="lg:col-span-5 bg-autumn-100/40 rounded-3xl p-6 sm:p-7 border border-autumn-200/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-autumn-950 font-serif flex items-center gap-2">
              <Users className="w-5 h-5 text-autumn-700" />
              <span>Who&apos;s Coming</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-autumn-200/80 text-autumn-800">
              {rsvps.length} {rsvps.length === 1 ? 'Response' : 'Responses'}
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-autumn-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-autumn-600" />
              <p className="text-sm">Loading attendees...</p>
            </div>
          ) : rsvps.length === 0 ? (
            <div className="py-12 text-center bg-white/70 rounded-2xl border border-dashed border-autumn-300 p-6">
              <Heart className="w-8 h-8 text-autumn-400 mx-auto mb-2" />
              <p className="font-semibold text-autumn-800 text-sm">Be the first to RSVP!</p>
              <p className="text-xs text-autumn-500 mt-1">Fill out the form on the left to add your name.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {rsvps.map(rsvp => (
                <div
                  key={rsvp.id}
                  className="bg-white rounded-2xl p-4 border border-autumn-200/70 shadow-sm relative group hover:shadow transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-autumn-950 text-base">{rsvp.name}</span>
                        {rsvp.attendance === 'yes' && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {rsvp.guest_count > 1 ? `+${rsvp.guest_count - 1} guest` : 'Going'}
                          </span>
                        )}
                        {rsvp.attendance === 'maybe' && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            Maybe
                          </span>
                        )}
                        {rsvp.attendance === 'no' && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Can&apos;t make it
                          </span>
                        )}
                      </div>

                      {/* Dietary Badges */}
                      {((rsvp.dietary_tags && rsvp.dietary_tags.length > 0) || rsvp.allergies) && (
                        <div className="mt-2 flex flex-wrap gap-1 items-center">
                          {rsvp.dietary_tags?.map(tag => (
                            <span
                              key={tag}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-cranberry-50 text-cranberry-700 border border-cranberry-200/60"
                            >
                              {tag}
                            </span>
                          ))}
                          {rsvp.allergies && (
                            <span className="text-[11px] text-cranberry-800 font-medium italic">
                              &ldquo;{rsvp.allergies}&rdquo;
                            </span>
                          )}
                        </div>
                      )}

                      {/* Host Note */}
                      {rsvp.notes && (
                        <p className="mt-2 text-xs text-autumn-700/90 italic bg-autumn-50/60 p-2 rounded-lg border border-autumn-100">
                          &ldquo;{rsvp.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(rsvp.id, rsvp.name)}
                      title="Remove RSVP"
                      className="opacity-0 group-hover:opacity-100 text-autumn-400 hover:text-cranberry-600 p-1 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
