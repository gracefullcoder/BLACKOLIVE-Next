import axios from "axios"

const products = [
    {
        title: 'MEXICAN MAGIC ',
        details: 'Iceberg lettuce and other veggies cater with mexican style dressing, garnished with black olive served with nachos',
        image: 'https://ik.imagekit.io/blackolive/BLACKOLIVE/product-mexican.png-1737015109440_CVfQWHUBx',
        fileId: '6788bf82432c476416f934e5',
        speciality: 'Newly added ',
        isAvailable: false,
        price: 159,
        finalPrice: 119,
        responses: []
    },
    {
        title: 'PANEER MARVELLA ',
        details: 'Exotic vegetable and cottage cheese with cheese dressings garnished with black olives',
        image: 'https://ik.imagekit.io/blackolive/BLACKOLIVE/product-1000095443.jpg-1737017856546_QtW2QVJkyk',
        fileId: '6788ca0e432c47641626c9e6',
        speciality: 'Popular ',
        isAvailable: false,
        price: 189,
        finalPrice: 149,
        responses: []
    },
    {
        title: 'POWER PLATINUM ',
        details: 'chickpeas with veggies, mix with pomegranate and cater with indian style red sauce dressing and garnish with coriander',
        image: 'https://ik.imagekit.io/blackolive/BLACKOLIVE/product-1000095542.png-1737022410907_Z2Bl32lxW',
        fileId: '6788dbd6432c47641690fa77',
        speciality: '',
        isAvailable: false,
        price: 159,
        finalPrice: 99,
        responses: []
    },
    {
        title: 'RICH DIAMOND ',
        details: 'Sprouted green grams and brown chickpeas cater with indian style red sauce dressing, garnished with sunflower seeds',
        image: 'https://ik.imagekit.io/blackolive/BLACKOLIVE/product-1000095566.heic-1737022657163_6au9_asXP',
        fileId: '6788dcc9432c47641697af2f',
        speciality: '',
        isAvailable: false,
        price: 139,
        finalPrice: 99,
        responses: []
    },
    {
        title: 'GOLDEN CORN ',
        details: 'American sweet corn with sprinkled freshly ground black pepper and a squeeze of zesty lemon',
        image: 'https://ik.imagekit.io/blackolive/BLACKOLIVE/product-1000095536.jpg-1737022753691_88ld9e6PP',
        fileId: '6788dd2a432c4764169a9445',
        speciality: 'for corn lover',
        isAvailable: false,
        price: 100,
        finalPrice: 79,
        responses: []
    },
    {
        title: 'MYSTIC MUSHROOM ',
        details: 'Exotic vegetable with mushroom infused in oregano garnished with black olive served with cheese dressing',
        image: 'https://ik.imagekit.io/blackolive/BLACKOLIVE/product-1000095535.jpg-1737022873621_37qU969La',
        fileId: '6788dda5432c4764169e96a9',
        speciality: '',
        isAvailable: false,
        price: 189,
        finalPrice: 149,
        responses: []
    }
]

const membershipproducts = [
    {
        title: 'WEEKLY MEMBERSHIP!',
        details: 'Weekly membership offers 6 fresh salads at discounted price .stay healthy every week!',
        image: 'https://ik.imagekit.io/blackolive/BLACKOLIVE/product-weekly.jpg-1737033999611_pyPXdVaB9',
        speciality: 'BLACK OLIVE',
        isAvailable: false,
        price: 694,
        finalPrice: 629,
        timings: [9, 12, 15, 18],
        days: 6,
        bonus: 2,
        responses: []
    },
    {
        title: 'MONTHLY MEMBERSHIP!',
        details: 'Monthly membership includes 24 fresh salads at discounted price. Perfect for a healthy lifestyle!',
        image: 'https://ik.imagekit.io/blackolive/BLACKOLIVE/product-monthly.jpg-1737034379631_Xhq-Fj-oa',
        speciality: 'BLACK OLIVE',
        isAvailable: false,
        price: 2776,
        finalPrice: 2449,
        timings: [9, 12, 15, 18],
        days: 24,
        bonus: 6,
        responses: []
    }
]

export const createProducts = async () => {
    for (let i = 0; i < products.length; i++) {
        const response: any = await axios.post(`http://localhost:3000/api/admin/products`, products[i])
        if (response.ok) console.log("created")
    }
}

export const createMemberships = async () => {
    for (let i = 0; i < membershipproducts.length; i++) {
        const response: any = await axios.post(`http://localhost:3000/api/admin/products`, { ...membershipproducts[i], timings: membershipproducts[i].timings.toString(), isMembership: true })
        if (response.ok) console.log("created")
    }
}

export const initTime = async () => {

}