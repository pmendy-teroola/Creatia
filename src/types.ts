export type ContentType = 
  | 'Instagram' 
  | 'LinkedIn' 
  | 'Email' 
  | 'Blog' 
  | 'WhatsApp' 
  | 'Video Script' 
  | 'Sales Page' 
  | 'Product Description';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  brandName?: string;
  businessType?: string;
  targetAudience?: string;
  brandTone?: string;
  brandGoal?: string;
  language?: string;
  createdAt: string;
}

export interface GeneratedContent {
  id?: string;
  uid: string;
  type: ContentType;
  title: string;
  content: string;
  cta?: string;
  hashtags?: string[];
  scheduledDate?: string;
  createdAt: string;
  status: 'draft' | 'scheduled' | 'posted';
}

export interface GenerationParams {
  type: ContentType;
  businessType: string;
  targetAudience: string;
  tone: string;
  goal: string;
  language: string;
  length: 'short' | 'medium' | 'long';
}
