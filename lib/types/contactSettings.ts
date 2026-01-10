export interface FormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface ContactSettings {
  _id?: string;
  _type?: string;
  email?: string;
  phone?: string;
  whatsappNumber?: string;
  showMap?: boolean;
  mapAddress?: string;
  openingHours?: string;
  formFields?: FormField[];
  clientId: string;
}
