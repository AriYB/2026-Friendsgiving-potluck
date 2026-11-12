import { Clock, MapPin, Sparkles, HelpCircle, Car, Gift } from 'lucide-react';

export default function EventDetails() {
  const scheduleItems = [
    { time: '6:00 PM', title: 'Doors Open, Appetizers & Warm Cider', desc: 'Arrive, settle in, grab a drink, and catch up with everyone.' },
    { time: '6:30 PM', title: 'The Feast is Served', desc: 'Dinner starts! Carving the turkey and digging into everyone’s delicious sides.' },
    { time: '7:45 PM', title: 'Toasts & Grateful Notes', desc: 'A quick moment together to share what we’re grateful for this year.' },
    { time: '8:15 PM', title: 'Desserts, Coffee & Board Games', desc: 'Pies, treats, coffee, and casual games into the evening.' },
  ];

  const faqs = [
    {
      q: 'What should I wear?',
      a: 'Comfy and cozy autumn casual! Flannel shirts, sweaters, and jeans are totally the vibe.',
    },
    {
      q: 'Do I need to bring my own serving utensils?',
      a: 'If your dish requires special tongs or ladles, please bring one labeled with your name on masking tape on the underside.',
    },
    {
      q: 'Where do I park?',
      a: 'Free street parking along the block and in the driveway. Carpooling is encouraged!',
    },
    {
      q: 'Can I bring games or drinks?',
      a: 'Yes, please! Feel free to bring your favorite board or card games, or a beverage to share.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-autumn-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-autumn-100 text-autumn-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-autumn-600" />
            <span>Event Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-autumn-950 font-serif">
            Day-of Schedule &amp; Details
          </h2>
          <p className="mt-2 text-autumn-800/80 text-sm sm:text-base max-w-lg mx-auto">
            Everything you need to know to make the gathering smooth and fun.
          </p>
        </div>

        {/* Schedule Timeline */}
        <div className="mb-14">
          <div className="max-w-2xl mx-auto space-y-4">
            {scheduleItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-autumn-50/50 border border-autumn-200/70"
              >
                <div className="flex-shrink-0 w-20 sm:w-24 font-bold text-autumn-700 text-xs sm:text-sm bg-white py-1.5 px-2.5 rounded-xl border border-autumn-200 text-center shadow-xs">
                  {item.time}
                </div>
                <div>
                  <h4 className="font-bold text-autumn-950 text-sm sm:text-base">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-autumn-700 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs & Logistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-autumn-200/80 bg-autumn-50/30 hover:bg-autumn-50/60 transition"
            >
              <h4 className="font-bold text-autumn-950 text-sm sm:text-base flex items-center gap-2 mb-1.5">
                <HelpCircle className="w-4 h-4 text-autumn-600 flex-shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs sm:text-sm text-autumn-750 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
