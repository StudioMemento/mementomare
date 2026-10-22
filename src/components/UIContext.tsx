import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { BookingDraft } from '../booking/validation';

export type Overlay = { type: 'menu' } | { type: 'booking' } | { type: 'gallery'; index: number } | null;
export type UIValue = {
  overlay: Overlay;
  setOverlay: Dispatch<SetStateAction<Overlay>>;
  draft: BookingDraft;
  setDraft: Dispatch<SetStateAction<BookingDraft>>;
  openBooking: (context?: { roomId?: string; interest?: string }) => void;
};
export const UIContext = createContext<UIValue | null>(null);
export function useUI() {
  const value = useContext(UIContext);
  if (!value) throw new Error('UIContext missing');
  return value;
}
