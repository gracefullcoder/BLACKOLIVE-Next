export type productType = {
    _id: string,
    image: any,
    title: string,
    speciality: string,
    price?: number,
    finalPrice?: number
    details: string,
    products?: string[],
    discountPercent?: number,
    timings?: number[],
    days?: number
    bonus?: number,
    isAvailable?: boolean
}

export type orderType = productType & { startDate: string }