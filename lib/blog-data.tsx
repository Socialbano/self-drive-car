import React from 'react';

// Export Interfaces
export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  content: React.ReactNode;
  faqs: FAQ[];
}

// Import all deeply optimized SEO articles
import { article1 } from './blog-articles/article1';
import { article2 } from './blog-articles/article2';
import { article3 } from './blog-articles/article3';
import { article4 } from './blog-articles/article4';
import { article5 } from './blog-articles/article5';

// Dynamic Categories Mapping
export const BLOG_CATEGORIES = [
  { name: 'Comprehensive Guides', count: 3 },
  { name: 'Pricing & Budget', count: 2 },
];

// The centralized Array
export const BLOG_POSTS: BlogPost[] = [
  article1,
  article2,
  article3,
  article4,
  article5
];
