export interface Testimonial {
  _id?: string;
  _type?: string;
  name: string;
  company?: string;
  position?: string;
  image?: {
    asset?: {
      _ref: string;
      _type: string;
    };
    hotspot?: any;
  };
  rating: number;
  text: string;
  projectRef?: {
    _ref: string;
    _type: string;
    slug?: {
      current: string;
    };
    title?: string;
  };
  serviceRef?: {
    _ref: string;
    _type: string;
    slug?: {
      current: string;
    };
    title?: string;
  };
  date?: string;
  location?: string;
  clientId: string;
  featured?: boolean;
}
