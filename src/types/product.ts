export type productType = {
    _id: string,
    image: any,
    title: string,
    speciality: string,
    price: number,
    finalPrice: number
    details: string,
    timings?: number[],
    days?: number
    bonus?: number,
    isAvailable?:boolean
}

export type orderType = productType & { startDate: string }