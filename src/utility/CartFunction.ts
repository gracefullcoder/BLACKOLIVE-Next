export const addItem = (setItems: any, product: any, quantity: number) => {
    setItems((prev: any) => [...prev, { product: { ...product }, quantity: quantity }])
}

export const removeItem = (productId: any, setItems: any) => {
    setItems((prev: any) => {
        return prev.filter((item: any) => item.product._id != productId)
    })
}

export const IncQty = (productId: any, setItems: any) => {
    setItems((prev: any) => {
        return prev.map((item: any) => {
            if (item.product._id == productId) {
                const newItem = { ...item, product: { ...item.product }, quantity: item.quantity + 1 }

                console.log(newItem)
                return newItem
            }
            return item;
        })
    })
}

export const DecQty = (productId: any, setItems: any) => {
    setItems((prev: any) => {
        return prev.map((item: any) => {
            if (item.product._id == productId) {
                const newItem = { ...item, product: { ...item.product }, quantity: Math.max(item.quantity - 1, 1) }

                return newItem
            }
            return item;
        })
    })
}
