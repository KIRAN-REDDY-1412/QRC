import { Restaurant, MenuCategory, MenuItem, RestaurantTemplateSettings, DietaryType } from '@/types';

export interface TemplateProps {
  restaurant: Restaurant;
  categories: MenuCategory[];
  items: MenuItem[];
  settings: RestaurantTemplateSettings;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  dietaryFilter: DietaryType | 'all';
  currentLanguage?: string;
  tableNumber?: string;
}
