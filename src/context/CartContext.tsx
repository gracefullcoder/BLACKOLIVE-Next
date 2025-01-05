"use client"
import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { useSession } from "next-auth/react";

export type CartItem = {
   product :{
    _id: string;
    title: string;
    price: number;
    image: string;
   },
   quantity: number
};

type CartContextType = { items: CartItem[], setItems: React.Dispatch<React.SetStateAction<CartItem[]>>, isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> };

export const cartContext = createContext<CartContextType>({ items: [], setItems: () => { }, isOpen: false, setIsOpen: () => { } });

export const CartProvider = ({ children }: { children: ReactNode }) => {

    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const session = useSession();

    useEffect(() => {
        if (session?.data?.user?.cart) {
            setItems(session.data.user.cart)
        }
    }, [session]);

    return (
        <cartContext.Provider value={{ items, setItems, isOpen, setIsOpen }}>
            {children}
        </cartContext.Provider>
    );
};

export const useCartContext = () => useContext(cartContext);