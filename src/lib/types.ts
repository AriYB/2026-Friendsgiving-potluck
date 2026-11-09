export type AttendanceStatus = 'yes' | 'no' | 'maybe';

export interface RSVP {
  id: string;
  created_at: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  attendance: AttendanceStatus;
  guest_count: number;
  allergies?: string | null;
  dietary_tags?: string[] | null;
  notes?: string | null;
}

export type PotluckCategory = 
  | 'Appetizers'
  | 'Main Dishes'
  | 'Side Dishes'
  | 'Desserts'
  | 'Drinks'
  | 'Supplies & Tableware';

export interface PotluckItem {
  id: string;
  created_at: string;
  category: PotluckCategory;
  item_name: string;
  servings?: number | null;
  dietary_notes?: string | null;
  status: 'needed' | 'claimed';
  brought_by: string;
  email?: string | null;
  rsvp_id?: string | null;
}

export const COMMON_DIETARY_TAGS = [
  'Gluten-Free',
  'Vegetarian',
  'Vegan',
  'Dairy-Free',
  'Peanut Allergy',
  'Tree Nut Allergy',
  'Shellfish Allergy',
  'Egg-Free',
  'Halal',
  'Kosher',
] as const;

export const POTLUCK_CATEGORIES: PotluckCategory[] = [
  'Main Dishes',
  'Side Dishes',
  'Appetizers',
  'Desserts',
  'Drinks',
  'Supplies & Tableware',
];
