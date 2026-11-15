import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { BannerSlide } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db: Firestore =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

export interface BrandingData {
  logo?: string;
  favicon?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface HeroBannersData {
  slides?: BannerSlide[];
  updatedAt?: string;
  updatedBy?: string;
}

export const DEFAULT_FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='15' fill='%23121118' stroke='%23C5A059' stroke-width='1.5'/%3E%3Crect x='13' y='5' width='6' height='4' rx='1' fill='%23FFFFFF'/%3E%3Crect x='14.5' y='9' width='3' height='2' fill='%23C5A059'/%3E%3Crect x='9' y='11' width='14' height='14' rx='3' fill='%23FFFFFF'/%3E%3Crect x='11' y='14' width='10' height='8' rx='1' fill='%23121118'/%3E%3Ccircle cx='16' cy='18' r='1.5' fill='%23C5A059'/%3E%3C/svg%3E?v=3";

/**
 * Dynamically injects or updates favicon across all modern browsers (Chrome, Edge, Brave, Safari, Firefox).
 */
export function applyDynamicFavicon(iconUrl: string): void {
  const targetUrl = iconUrl && iconUrl.trim().length > 0 ? iconUrl : DEFAULT_FAVICON;
  const rels = ['icon', 'shortcut icon', 'apple-touch-icon'];

  rels.forEach((rel) => {
    let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    if (targetUrl.startsWith('data:image/svg')) {
      link.type = 'image/svg+xml';
    } else if (targetUrl.startsWith('data:image/png')) {
      link.type = 'image/png';
    } else if (targetUrl.startsWith('data:image/jpeg') || targetUrl.startsWith('data:image/jpg')) {
      link.type = 'image/jpeg';
    } else {
      link.type = 'image/x-icon';
    }
    link.href = targetUrl;
  });
}

/**
 * Loads the current branding configuration from Firestore site_settings/branding.
 */
export async function getBrandingSettings(): Promise<BrandingData | null> {
  try {
    const brandingRef = doc(db, 'site_settings', 'branding');
    const snap = await getDoc(brandingRef);
    if (snap.exists()) {
      return snap.data() as BrandingData;
    }
  } catch (error) {
    console.warn('Firestore branding fetch error, falling back to local storage cache:', error);
  }
  return null;
}

/**
 * Persists logo and/or favicon Base64 data directly to Firestore site_settings/branding.
 */
export async function saveBrandingSettings(branding: { logo?: string; favicon?: string }): Promise<void> {
  try {
    const brandingRef = doc(db, 'site_settings', 'branding');
    const payload: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    if (branding.logo !== undefined) {
      payload.logo = branding.logo;
    }
    if (branding.favicon !== undefined) {
      payload.favicon = branding.favicon;
    }
    await setDoc(brandingRef, payload, { merge: true });
  } catch (error) {
    console.error('Failed to persist branding in Firestore:', error);
    throw error;
  }
}

/**
 * Subscribes to real-time updates for site branding so all browsers, tabs, and devices sync live.
 */
export function subscribeBrandingSettings(
  onUpdate: (branding: BrandingData) => void,
  onError?: (error: Error) => void
): () => void {
  const brandingRef = doc(db, 'site_settings', 'branding');
  return onSnapshot(
    brandingRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as BrandingData);
      }
    },
    (err) => {
      console.warn('Firestore branding subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Loads the current hero banner slides from Firestore site_settings/hero_banners.
 */
export async function getHeroBanners(): Promise<BannerSlide[] | null> {
  const path = 'site_settings/hero_banners';
  try {
    const bannersRef = doc(db, 'site_settings', 'hero_banners');
    const snap = await getDoc(bannersRef);
    if (snap.exists()) {
      const data = snap.data() as HeroBannersData;
      if (Array.isArray(data.slides) && data.slides.length > 0) {
        return data.slides;
      }
    }
  } catch (error) {
    console.warn('Firestore hero banners fetch error, falling back to local cache or defaults:', error);
  }
  return null;
}

/**
 * Persists hero banner slides directly to Firestore under document site_settings/hero_banners.
 * Uploaded Base64 image data strings, URLs, and custom text options are saved directly in this document.
 */
export async function saveHeroBanners(slides: BannerSlide[]): Promise<void> {
  const path = 'site_settings/hero_banners';
  try {
    const bannersRef = doc(db, 'site_settings', 'hero_banners');
    const payload: Record<string, unknown> = {
      slides,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(bannersRef, payload, { merge: true });
  } catch (error) {
    console.error('Failed to persist hero banners in Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribes to real-time updates for hero banner slides so all browsers, tabs, and devices sync live without page reload.
 */
export function subscribeHeroBanners(
  onUpdate: (slides: BannerSlide[]) => void,
  onError?: (error: Error) => void
): () => void {
  const path = 'site_settings/hero_banners';
  const bannersRef = doc(db, 'site_settings', 'hero_banners');
  return onSnapshot(
    bannersRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as HeroBannersData;
        if (Array.isArray(data.slides) && data.slides.length > 0) {
          onUpdate(data.slides);
        }
      }
    },
    (err) => {
      console.warn('Firestore hero banners subscription error:', err);
      if (onError) onError(err);
    }
  );
}

