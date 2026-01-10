import type { MenuItem } from './navigation';

export interface SliderItem {
  image?: string;
  title?: string;
  description?: string;
  linkText?: string;
  linkHref?: string;
}

export interface BeforeAfterItem {
  before?: string;
  after?: string;
  title?: string;
  subtitle?: string;
}

export interface CompanyData {
  name?: string;
  logoText?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
}

export interface FooterLink {
  text: string;
  href?: string;
  pageRef?: {
    _type: string;
    slug?: {
      current: string;
    };
  };
}

export interface FooterData {
  locations?: any[];
  openingHours?: any;
  copyright?: string;
  links?: FooterLink[];
}

export interface SiteData {
  clientId?: string;
  company?: CompanyData;
  footer?: FooterData;
  theme?: Record<string, any>;
  slider?: { slides?: SliderItem[]; beforeAfter?: BeforeAfterItem[] };
  heroSections?: SliderItem[];
  services?: any[];
  projects?: any[];
  menuItems?: MenuItem[];
  [key: string]: any;
}

export default SiteData;
