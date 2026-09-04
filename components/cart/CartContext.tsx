"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    unit: string;
    image: string;
    stock: number;
  }, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "terranova_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Charger le panier depuis le localStorage au montage
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        setItems(parsed);

        // Mettre à jour immédiatement les prix si l'administrateur les a modifiés
        if (parsed.length > 0) {
          const ids = parsed.map((item) => item.id).join(",");
          fetch(`/api/products/sync-cart?ids=${ids}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.products && Array.isArray(data.products)) {
                setItems((prev) =>
                  prev.map((item) => {
                    const fresh = data.products.find((p: any) => p.id === item.id);
                    if (fresh) {
                      return {
                        ...item,
                        price: fresh.price,
                        stock: fresh.stock,
                        name: fresh.name,
                      };
                    }
                    return item;
                  })
                );
              }
            })
            .catch(() => {});
        }
      }
    } catch (e) {
      console.warn("Could not load cart from localStorage", e);
    }
  }, []);

  // Sauvegarder dans le localStorage à chaque modification
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn("Could not save cart to localStorage", e);
      }
    }
  }, [items, isMounted]);

  const addItem = (
    product: {
      id: string;
      name: string;
      slug: string;
      price: number;
      unit: string;
      image: string;
      stock: number;
    },
    quantity: number = 1
  ) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock || 999);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          unit: product.unit,
          quantity: Math.min(quantity, product.stock || 999),
          image: product.image,
          stock: product.stock,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const maxStock = item.stock || 999;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
