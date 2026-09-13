import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Clapperboard,
  HeartPulse,
  GraduationCap,
  Home,
  MoreHorizontal,
  Banknote,
  Gift,
  Briefcase,
  TrendingUp,
  PartyPopper,
  Tag,
} from "lucide-react";

const iconMap = {
  utensils: Utensils,
  car: Car,
  "shopping-bag": ShoppingBag,
  receipt: Receipt,
  clapperboard: Clapperboard,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  home: Home,
  "more-horizontal": MoreHorizontal,
  banknote: Banknote,
  gift: Gift,
  briefcase: Briefcase,
  "trending-up": TrendingUp,
  "party-popper": PartyPopper,
  tag: Tag,
};

export function getCategoryIcon(iconKey) {
  return iconMap[iconKey] || Tag;
}
