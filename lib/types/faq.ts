export interface FAQ {
  _id?: string;
  _type?: string;
  question: string;
  answer?: any[]; // Portable Text blocks
  category?: string;
  order?: number;
  clientId: string;
}

export interface FAQCategory {
  category: string;
  faqs: FAQ[];
}
