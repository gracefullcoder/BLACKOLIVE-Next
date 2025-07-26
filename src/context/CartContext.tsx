"use client"
import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { useSession } from "next-auth/react";
import { productType } from "../types/product";
import { featureDetails } from "../actions/Features";

export type CartItem = {
    product: productType,
    quantity: number
};

type CartContextType = {
    items: CartItem[],
    setItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    features: any
};

export const cartContext = createContext<CartContextType>({ items: [], setItems: () => { }, isOpen: false, setIsOpen: () => { }, features: null });

export const CartProvider = ({ children }: { children: ReactNode }) => {

    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [features, setFeatures] = useState<any>(null);

    const session = useSession();

    useEffect(() => {
        if (session?.data?.user?.cart) {
            setItems(session.data.user.cart)
        }
    }, [session]);

    useEffect(() => {
        const getFeatures = async () => {
            const features = await featureDetails();
            if (features.success) setFeatures(features?.data);
        }

        if(!features) getFeatures();
    }, [])

    return (
        <cartContext.Provider value={{ items, setItems, isOpen, setIsOpen, features }}>
            {children}
        </cartContext.Provider>
    );
};

export const useCartContext = () => useContext(cartContext);