'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PotluckItem, PotluckCategory, POTLUCK_CATEGORIES } from '@/lib/types';
import { 
  UtensilsCrossed, 
  Plus, 
  Check, 
  Trash2, 
  Wine, 
  Cookie, 
  Salad, 
  Soup, 
  Package, 
  Loader2, 
  AlertCircle,
  Tag
} from 'lucide-react';

const CATEGORY_ICONS: Record<PotluckCategory, React.ReactNode> = {
  'Main Dishes': <Soup className="w-4 h-4" />,
  'Side Dishes': <Salad className="w-4 h-4" />,
  'Appetizers': <UtensilsCrossed className="w-4 h-4" />,
  'Desserts': <Cookie className="w-4 h-4" />,
  'Drinks': <Wine className="w-4 h-4" />,
  'Supplies & Tableware': <Package className="w-4 h-4" />,
};

export default function PotluckSection() {
  const [items, setItems] = useState<PotluckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [claimingItemId, setClaimingItemId] = useState<string | null>(null);
  const [claimerName, setClaimerName] = useState('');

  // New item form
  const [newCategory, setNewCategory] = useState<PotluckCategory>('Side Dishes');
  const [newItemName, setNewItemName] = useState('');
  const [newBroughtBy, setNewBroughtBy] = useState('');
  const [newServings, setNewServings] = useState<number>(8);
  const [newDietaryNotes, setNewDietaryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('potluck_items')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err: unknown) {
      console.error('Error fetching potluck items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleClaim = async (item: PotluckItem) => {
    if (!claimerName.trim()) return;

    try {
      const { error } = await supabase
        .from('potluck_items')
        .update({
          status: 'claimed',
          brought_by: claimerName.trim(),
        })
        .eq('id', item.id);

      if (error) throw error;
      setItems(prev =>
        prev.map(i =>
          i.id === item.id ? { ...i, status: 'claimed', brought_by: claimerName.trim() } : i
        )
      );
      setClaimingItemId(null);
      setClaimerName('');
    } catch (err: unknown) {
      console.error('Error claiming item:', err);
      alert('Could not claim item. Please try again.');
    }
  };

  const handleUnclaim = async (item: PotluckItem) => {
    if (!confirm(`Release "${item.item_name}" back to needed list?`)) return;

    try {
      const { error } = await supabase
        .from('potluck_items')
        .update({
          status: 'needed',
          brought_by: '',
        })
        .eq('id', item.id);

      if (error) throw error;
      setItems(prev =>
        prev.map(i =>
          i.id === item.id ? { ...i, status: 'needed', brought_by: '' } : i
        )
      );
    } catch (err: unknown) {
      console.error('Error unclaiming item:', err);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const { error } = await supabase.from('potluck_items').delete().eq('id', id);
      if (error) throw error;
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err: unknown) {
      console.error('Error deleting item:', err);
    }
  };

  const handleAddNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newBroughtBy.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('potluck_items')
        .insert([
          {
            category: newCategory,
            item_name: newItemName.trim(),
            brought_by: newBroughtBy.trim(),
            servings: newServings,
            dietary_notes: newDietaryNotes.trim(),
            status: 'claimed',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) setItems(prev => [...prev, data]);

      setNewItemName('');
      setNewBroughtBy('');
      setNewDietaryNotes('');
      setShowAddModal(false);
    } catch (err: unknown) {
      console.error('Error adding item:', err);
      alert('Failed to add potluck item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats
  const totalItems = items.length;
  const claimedCount = items.filter(i => i.status === 'claimed').length;
  const neededCount = items.filter(i => i.status === 'needed').length;
  const progressPercent = totalItems > 0 ? Math.round((claimedCount / totalItems) * 100) : 0;

  const filteredItems = items.filter(item => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Needed') return item.status === 'needed';
    if (activeTab === 'Claimed') return item.status === 'claimed';
    return item.category === activeTab;
  });

  return (
    <section id="potluck-section" className="py-12 sm:py-16 bg-autumn-50/50 border-t border-autumn-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-harvest-100 text-harvest-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <UtensilsCrossed className="w-3.5 h-3.5 text-harvest-700" />
              <span>Potluck Coordination</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-autumn-950 font-serif">
              What We&apos;re Bringing
            </h2>
            <p className="mt-2 text-autumn-800/80 text-sm sm:text-base max-w-xl">
              Claim a needed dish below, or add your signature family recipe to the table!
            </p>
          </div>

          {/* Add Item Button */}
          <div>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-autumn-600 hover:bg-autumn-700 text-white font-semibold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Bring Something Else</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker Card */}
        <div className="bg-white rounded-2xl p-5 border border-autumn-200/80 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
            <span className="font-bold text-autumn-950 text-sm">Feast Preparedness</span>
            <span className="text-xs font-semibold text-autumn-700 bg-autumn-100 px-2.5 py-1 rounded-full">
              {claimedCount} of {totalItems} items covered ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-3 bg-autumn-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-autumn-500 via-harvest-500 to-autumn-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-autumn-600 mt-2 font-medium">
            <span>{neededCount} needed items remaining</span>
            <span>{claimedCount} dishes claimed</span>
          </div>
        </div>

        {/* Filters / Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {['All', 'Needed', 'Claimed', ...POTLUCK_CATEGORIES].map(tab => {
            const count =
              tab === 'All'
                ? items.length
                : tab === 'Needed'
                ? neededCount
                : tab === 'Claimed'
                ? claimedCount
                : items.filter(i => i.category === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-autumn-700 text-white shadow-sm'
                    : 'bg-white text-autumn-800 border border-autumn-200/80 hover:bg-autumn-100/60'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === tab ? 'bg-white/20 text-white' : 'bg-autumn-100 text-autumn-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Potluck Grid */}
        {loading ? (
          <div className="py-16 text-center text-autumn-600">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-autumn-600" />
            <p className="text-sm">Loading feast menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-autumn-300 p-8">
            <UtensilsCrossed className="w-10 h-10 text-autumn-400 mx-auto mb-3" />
            <p className="font-bold text-autumn-900 text-lg">No dishes found in this filter.</p>
            <p className="text-sm text-autumn-600 mt-1">
              Be the first to add something delicious in this category!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => {
              const isClaimed = item.status === 'claimed';
              const isClaiming = claimingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-5 border transition duration-200 flex flex-col justify-between relative group ${
                    isClaimed
                      ? 'bg-white/95 border-autumn-200/70 shadow-sm'
                      : 'bg-harvest-50/50 border-harvest-300/80 shadow-sm hover:shadow'
                  }`}
                >
                  <div>
                    {/* Header badge & Category */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-autumn-100 text-autumn-800">
                        {CATEGORY_ICONS[item.category]}
                        <span>{item.category}</span>
                      </span>

                      {isClaimed ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          <span>Covered</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-harvest-200 text-harvest-900 animate-pulse">
                          Needed
                        </span>
                      )}
                    </div>

                    {/* Dish Title */}
                    <h4 className="font-bold text-autumn-950 text-base sm:text-lg mb-1 leading-snug">
                      {item.item_name}
                    </h4>

                    {/* Details & Notes */}
                    <div className="space-y-1 text-xs text-autumn-700 mb-4">
                      {item.servings && (
                        <p className="text-autumn-600">Serves ~{item.servings} guests</p>
                      )}
                      {item.dietary_notes && (
                        <p className="inline-flex items-center gap-1 text-cranberry-800 font-medium bg-cranberry-50 px-2 py-0.5 rounded border border-cranberry-200/50">
                          <Tag className="w-3 h-3 text-cranberry-600" />
                          <span>{item.dietary_notes}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer / Claim action */}
                  <div className="pt-3 border-t border-autumn-100">
                    {isClaimed ? (
                      <div className="flex items-center justify-between">
                        <div className="text-xs">
                          <span className="text-autumn-500 block">Bringing this:</span>
                          <span className="font-bold text-autumn-900 text-sm">{item.brought_by}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleUnclaim(item)}
                            title="Release dish"
                            className="text-xs text-autumn-500 hover:text-autumn-800 underline px-1.5 py-1"
                          >
                            Unclaim
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.item_name)}
                            title="Delete dish"
                            className="opacity-0 group-hover:opacity-100 text-autumn-400 hover:text-cranberry-600 p-1 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : isClaiming ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Your name..."
                          value={claimerName}
                          onChange={e => setClaimerName(e.target.value)}
                          autoFocus
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-harvest-400 focus:outline-none focus:ring-2 focus:ring-harvest-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleClaim(item)}
                            className="flex-1 py-1 px-3 text-xs font-bold rounded-lg bg-harvest-600 hover:bg-harvest-700 text-white transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => {
                              setClaimingItemId(null);
                              setClaimerName('');
                            }}
                            className="py-1 px-2.5 text-xs rounded-lg border border-autumn-200 text-autumn-600 hover:bg-autumn-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setClaimingItemId(item.id);
                          setClaimerName('');
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-harvest-500/90 hover:bg-harvest-600 active:bg-harvest-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>I&apos;ll Bring This!</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Custom Dish Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-autumn-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
              <h3 className="text-2xl font-bold text-autumn-950 font-serif mb-2">
                Bring a Custom Dish
              </h3>
              <p className="text-xs text-autumn-600 mb-5">
                Got a special holiday dish, side, drink, or dessert? Sign up below!
              </p>

              <form onSubmit={handleAddNewItem} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-autumn-700 mb-1">
                    Dish / Item Name <span className="text-cranberry-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    placeholder="e.g. Grandma's Sweet Potato Pie"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-autumn-200 text-sm focus:outline-none focus:ring-2 focus:ring-autumn-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider text-autumn-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as PotluckCategory)}
                      className="w-full px-3 py-2 rounded-xl border border-autumn-200 text-sm focus:outline-none focus:ring-2 focus:ring-autumn-500 bg-white"
                    >
                      {POTLUCK_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider text-autumn-700 mb-1">
                      Servings (~people)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={newServings}
                      onChange={e => setNewServings(parseInt(e.target.value) || 8)}
                      className="w-full px-3 py-2 rounded-xl border border-autumn-200 text-sm focus:outline-none focus:ring-2 focus:ring-autumn-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-autumn-700 mb-1">
                    Your Name <span className="text-cranberry-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newBroughtBy}
                    onChange={e => setNewBroughtBy(e.target.value)}
                    placeholder="e.g. Jordan Smith"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-autumn-200 text-sm focus:outline-none focus:ring-2 focus:ring-autumn-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-autumn-700 mb-1">
                    Dietary Info / Ingredients (Optional)
                  </label>
                  <input
                    type="text"
                    value={newDietaryNotes}
                    onChange={e => setNewDietaryNotes(e.target.value)}
                    placeholder="e.g. Vegan, Gluten-Free, Contains Almonds"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-autumn-200 text-sm focus:outline-none focus:ring-2 focus:ring-autumn-500"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-autumn-200 font-semibold text-autumn-700 text-sm hover:bg-autumn-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-autumn-600 hover:bg-autumn-700 font-semibold text-white text-sm shadow transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Adding...' : 'Add to Feast'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
