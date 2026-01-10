export interface TeamMember {
  _id?: string;
  _type?: string;
  name: string;
  position: string;
  image: {
    asset?: {
      _ref: string;
      _type: string;
    };
    hotspot?: any;
  };
  bio?: any[]; // Portable Text blocks
  phone?: string;
  email?: string;
  specializations?: string[];
  order?: number;
  clientId: string;
}
