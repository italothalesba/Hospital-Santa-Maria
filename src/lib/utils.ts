import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: any) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(d);
}

export function getGoogleDriveDirectLink(url: string) {
  if (!url) return '';
  
  // Handle shared file links: https://drive.google.com/file/d/ID/view?usp=sharing
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://lh3.googleusercontent.com/u/0/d/${fileMatch[1]}`;
  }

  // Handle open links: https://drive.google.com/open?id=ID
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/u/0/d/${idMatch[1]}`;
  }

  // Return original if no match (maybe it's already a direct link)
  return url;
}
