export interface MembershipCreationType {
    user: string,
    adminOrder?: any | null,
    category: string,
    products: any,
    days: number,
    discountPercent: number,
    startDate: Date,
    time: string,
    address: any,
    contact: number,
    message: string,
    extraCharge?: number,
    isPaid: boolean,
    payementId?: string
}

export interface OrderCreationType {
    userId: string,
    orderItems: Array<{ product: string, quantity: number, priceCharged: number }>,
    addressId: number,
    contact: number,
    time: string,
    message: string,
    isPaid: boolean,
    totalAmount: number,
    deliveryCharge: string,
    paymentId?: string,
    adminOrder?: any
}