export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: 'Saúde' | 'Tecnologia' | 'Especialidades' | 'Institucional';
  status: 'draft' | 'published';
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface SiteSettings {
  logoUrl: string;
  whatsappNumber: string;
  whatsappFormatted: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  contactEmail: string;
  yearsOfCredibility: number;
}

export interface Specialist {
  id?: string;
  name: string;
  role: string;
  description: string;
  image: string;
  crm?: string;
  cremec?: string;
  crn?: string;
  order?: number;
}

export interface Insurance {
  id: string;
  name: string;
  logoUrl: string;
  order?: number;
}

export interface Service {
  id?: string;
  title: string;
  description?: string;
  icon?: string;
}
