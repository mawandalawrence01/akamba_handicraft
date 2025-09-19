"use client"

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  maxQuantity?: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(i => i.productId === item.productId)
          
          if (existingItem) {
            const newQuantity = existingItem.quantity + 1
            const maxQty = existingItem.maxQuantity || Infinity
            
            if (newQuantity <= maxQty) {
              return {
                ...state,
                items: state.items.map(i =>
                  i.productId === item.productId
                    ? { ...i, quantity: newQuantity }
                    : i
                )
              }
            }
            return state // Don't add if max quantity reached
          } else {
            return {
              ...state,
              items: [...state.items, { ...item, quantity: 1 }]
            }
          }
        })
      },
      
      removeItem: (productId) => {
        set((state) => ({
          ...state,
          items: state.items.filter(item => item.productId !== productId)
        }))
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set((state) => ({
          ...state,
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity: Math.min(quantity, item.maxQuantity || Infinity) }
              : item
          )
        }))
      },
      
      clearCart: () => {
        set((state) => ({ ...state, items: [] }))
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
)
