"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { formatPrice } from "./menu";

export type CartLine = {
  itemId: string;
  itemName: string;
  itemEmoji?: string;
  itemPrice: number;
  accompId?: string;
  accompLabel?: string;
  accompPrice?: number;
  qty: number;
};

export type DetailedLine = {
  itemId: string;
  itemName: string;
  itemEmoji?: string;
  accompId?: string;
  accompLabel?: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
};

type State = { lines: CartLine[] };

type Action =
  | { type: "add"; line: Omit<CartLine, "qty"> }
  | { type: "remove"; itemId: string; accompId?: string }
  | { type: "setQty"; itemId: string; qty: number; accompId?: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

const STORAGE_KEY = "homel-cart-v3";

function lineKey(itemId: string, accompId?: string) {
  return accompId ? `${itemId}:${accompId}` : itemId;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines };

    case "add": {
      const key = lineKey(action.line.itemId, action.line.accompId);
      const exists = state.lines.find(
        (l) => lineKey(l.itemId, l.accompId) === key
      );
      if (exists) {
        return {
          lines: state.lines.map((l) =>
            lineKey(l.itemId, l.accompId) === key ? { ...l, qty: l.qty + 1 } : l
          ),
        };
      }
      return { lines: [...state.lines, { ...action.line, qty: 1 }] };
    }

    case "remove": {
      const key = lineKey(action.itemId, action.accompId);
      return { lines: state.lines.filter((l) => lineKey(l.itemId, l.accompId) !== key) };
    }

    case "setQty": {
      const key = lineKey(action.itemId, action.accompId);
      if (action.qty <= 0) {
        return { lines: state.lines.filter((l) => lineKey(l.itemId, l.accompId) !== key) };
      }
      return {
        lines: state.lines.map((l) =>
          lineKey(l.itemId, l.accompId) === key ? { ...l, qty: action.qty } : l
        ),
      };
    }

    case "clear":
      return { lines: [] };
  }
}

type CartContextValue = {
  lines: CartLine[];
  detailedLines: DetailedLine[];
  totalQty: number;
  totalAmount: number;
  isOpen: boolean;
  add: (line: Omit<CartLine, "qty">) => void;
  remove: (itemId: string, accompId?: string) => void;
  setQty: (itemId: string, qty: number, accompId?: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) {
          dispatch({ type: "hydrate", lines: parsed.filter((l) => l.itemId && l.itemName) });
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {}
  }, [state.lines, hydrated]);

  const detailedLines = useMemo<DetailedLine[]>(() => {
    if (!hydrated) return [];
    return state.lines.map((l) => {
      const unitPrice = l.accompPrice ?? l.itemPrice;
      return {
        itemId: l.itemId,
        itemName: l.itemName,
        itemEmoji: l.itemEmoji,
        accompId: l.accompId,
        accompLabel: l.accompLabel,
        qty: l.qty,
        unitPrice,
        subtotal: unitPrice * l.qty,
      };
    });
  }, [state.lines, hydrated]);

  const totalQty    = hydrated ? detailedLines.reduce((s, l) => s + l.qty, 0) : 0;
  const totalAmount = hydrated ? detailedLines.reduce((s, l) => s + l.subtotal, 0) : 0;

  const value: CartContextValue = {
    lines: state.lines,
    detailedLines,
    totalQty,
    totalAmount,
    isOpen,
    add: useCallback((line) => dispatch({ type: "add", line }), []),
    remove: useCallback((itemId, accompId) => dispatch({ type: "remove", itemId, accompId }), []),
    setQty: useCallback((itemId, qty, accompId) => dispatch({ type: "setQty", itemId, qty, accompId }), []),
    clear: useCallback(() => dispatch({ type: "clear" }), []),
    openCart:  useCallback(() => setIsOpen(true), []),
    closeCart: useCallback(() => setIsOpen(false), []),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
