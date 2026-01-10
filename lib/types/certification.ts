export interface Certification {
  _id?: string;
  _type?: string;
  name: string;
  issuer?: string;
  logo?: {
    asset?: {
      _ref: string;
      _type: string;
    };
    hotspot?: any;
  };
  certificateNumber?: string;
  validFrom?: string;
  validUntil?: string;
  description?: string;
  clientId: string;
}
