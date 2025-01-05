'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '../context/CartContext';

export const Providers = ({ children }: { children: React.ReactNode }) => {

  return (
    <SessionProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  );

};