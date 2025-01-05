// import marvella from "../public/assets/paneer.png"
// import platinum from "../public/assets/power.png"
// import diamond from "../public/assets/rich.png"
// import mushroom from "../public/assets/mushroom.png"
// import corn from "../public/assets/corn.png"
// import mexican from "../public/assets/mexican.png"
// import weekly from "../public/assets/weekly.jpg"
// import monthly from "../public/assets/monthly.jpg"


export type product = {
    _id: number,
    image: any,
    title: string,
    speciality: string,
    price: number,
    finalPrice: number
    details: string
}

// export const allProducts: product[] = [
//     {
//         _id: 1,
//         image: marvella,
//         title: "PANNER MARVELLA",
//         speciality: "BLACK OLIVE",
//         price: 189,
//         finalPrice: 149,
//         details: "Exotic vegetable and cottage cheese with cheese dressings garnished with black olives"
//     },
//     {
//         _id: 2,
//         image: platinum,
//         title: "POWER PLATINUM",
//         speciality: "BLACK OLIVE",
//         price: 159,
//         finalPrice: 99,
//         details: "Steam chickpeas with veggies, mix with pomegranate and cater with indian style red sauce dressing and garnish with coriander"
//     },
//     {
//         _id: 3,
//         image: diamond,
//         title: "RICH DIAMOND",
//         speciality: "BLACK OLIVE",
//         price: 139,
//         finalPrice: 99,
//         details: "Sprouted green grams and brown chickpeas cater with indian style red sauce dressing, garnished with sunflower seeds"
//     },
//     {
//         _id: 4,
//         image: mushroom,
//         title: "MYSTIC MUSHROOM",
//         speciality: "BLACK OLIVE",
//         price: 189,
//         finalPrice: 149,
//         details: "Exotic vegetable with mushroom infused in oregano garnished with black olive served with cheese dressing"
//     },
//     {
//         _id: 5,
//         image: corn,
//         title: "GOLDEN CORN",
//         speciality: "BLACK OLIVE",
//         price: 99,
//         finalPrice: 69,
//         details: "American sweet corn with sprinkled freshly ground black pepper and a squeeze of zesty lemon"
//     },
//     {
//         _id: 6,
//         image: mexican,
//         title: "MEXICAN MAGIC",
//         speciality: "BLACK OLIVE",
//         price: 159,
//         finalPrice: 119,
//         details: "Iceberg lettuce and other veggies cater with mexican style dressing, garnished with black olive served with nachos"
//     },
//     {
//         _id: 7,
//         image: weekly,
//         title: "WEEKLY MEMBERSHIP!",
//         speciality: "BLACK OLIVE",
//         price: 694,
//         finalPrice: 629,
//         details: "Weekly membership offers 6 fresh salads with 2 bonus days at discounted price .stay healthy every week!"
//     },
//     {
//         _id: 8,
//         image: monthly,
//         title: "MONTHLY MEMBERSHIP!",
//         speciality: "BLACK OLIVE",
//         price: 2776,
//         finalPrice: 2449,
//         details: "Monthly membership includes 24 fresh salads, with six bonus days at discounted price.perfect for a healthy lifestyle! "
//     }
// ]

// export const salads: product[] = [
//     {
//         _id: 1,
//         image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/paneer.png?updatedAt=1735428955087",
//         title: "PANNER MARVELLA",
//         speciality: "BLACK OLIVE",
//         price: 189,
//         finalPrice: 149,
//         details: "Exotic vegetable and cottage cheese with cheese dressings garnished with black olives"
//     },
//     {
//         _id: 2,
//         image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/power.png?updatedAt=1735428954667",
//         title: "POWER PLATINUM",
//         speciality: "BLACK OLIVE",
//         price: 159,
//         finalPrice: 99,
//         details: "Steam chickpeas with veggies, mix with pomegranate and cater with indian style red sauce dressing and garnish with coriander"
//     },
//     {
//         _id: 3,
//         image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/rich.png?updatedAt=1735428949065",
//         title: "RICH DIAMOND",
//         speciality: "BLACK OLIVE",
//         price: 139,
//         finalPrice: 99,
//         details: "Sprouted green grams and brown chickpeas cater with indian style red sauce dressing, garnished with sunflower seeds"
//     },
//     {
//         _id: 4,
//         image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/mushroom.png?updatedAt=1735428954699",
//         title: "MYSTIC MUSHROOM",
//         speciality: "BLACK OLIVE",
//         price: 189,
//         finalPrice: 149,
//         details: "Exotic vegetable with mushroom infused in oregano garnished with black olive served with cheese dressing"
//     },
//     {
//         _id: 5,
//         image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/corn.png?updatedAt=1735428928947",
//         title: "GOLDEN CORN",
//         speciality: "BLACK OLIVE",
//         price: 99,
//         finalPrice: 69,
//         details: "American sweet corn with sprinkled freshly ground black pepper and a squeeze of zesty lemon"
//     },
//     {
//         _id: 6,
//         image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/mexican.png?updatedAt=1735428942589",
//         title: "MEXICAN MAGIC",
//         speciality: "BLACK OLIVE",
//         price: 159,
//         finalPrice: 119,
//         details: "Iceberg lettuce and other veggies cater with mexican style dressing, garnished with black olive served with nachos"
//     }
// ]

// export const membership: product[] = [
//     {
//         _id: 7,
//         image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/weekly.jpg?updatedAt=1735428889502",
//         title: "WEEKLY MEMBERSHIP!",
//         speciality: "BLACK OLIVE",
//         price: 694,
//         finalPrice: 629,
//         details: "Weekly membership offers 6 fresh salads with 2 bonus days at discounted price .stay healthy every week!"
//     },
//     {
//         _id: 8,
//         image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/monthly.jpg?updatedAt=1735428889483",
//         title: "MONTHLY MEMBERSHIP!",
//         speciality: "BLACK OLIVE",
//         price: 2776,
//         finalPrice: 2449,
//         details: "Monthly membership includes 24 fresh salads, with six bonus days at discounted price.perfect for a healthy lifestyle! "
//     }
// ]

export const allProductsIK: product[] = [
    {
        _id: 1,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/paneer.png?updatedAt=1735428955087",
        title: "PANNER MARVELLA",
        speciality: "BLACK OLIVE",
        price: 189,
        finalPrice: 149,
        details: "Exotic vegetable and cottage cheese with cheese dressings garnished with black olives"
    },
    {
        _id: 2,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/power.png?updatedAt=1735428954667",
        title: "POWER PLATINUM",
        speciality: "BLACK OLIVE",
        price: 159,
        finalPrice: 99,
        details: "Steam chickpeas with veggies, mix with pomegranate and cater with indian style red sauce dressing and garnish with coriander"
    },
    {
        _id: 3,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/rich.png?updatedAt=1735428949065",
        title: "RICH DIAMOND",
        speciality: "BLACK OLIVE",
        price: 139,
        finalPrice: 99,
        details: "Sprouted green grams and brown chickpeas cater with indian style red sauce dressing, garnished with sunflower seeds"
    },
    {
        _id: 4,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/mushroom.png?updatedAt=1735428954699",
        title: "MYSTIC MUSHROOM",
        speciality: "BLACK OLIVE",
        price: 189,
        finalPrice: 149,
        details: "Exotic vegetable with mushroom infused in oregano garnished with black olive served with cheese dressing"
    },
    {
        _id: 5,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/corn.png?updatedAt=1735428928947",
        title: "GOLDEN CORN",
        speciality: "BLACK OLIVE",
        price: 99,
        finalPrice: 69,
        details: "American sweet corn with sprinkled freshly ground black pepper and a squeeze of zesty lemon"
    },
    {
        _id: 6,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/mexican.png?updatedAt=1735428942589",
        title: "MEXICAN MAGIC",
        speciality: "BLACK OLIVE",
        price: 159,
        finalPrice: 119,
        details: "Iceberg lettuce and other veggies cater with mexican style dressing, garnished with black olive served with nachos"
    },
    {
        _id: 7,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/weekly.jpg?updatedAt=1735428889502",
        title: "WEEKLY MEMBERSHIP!",
        speciality: "BLACK OLIVE",
        price: 694,
        finalPrice: 629,
        details: "Weekly membership offers 6 fresh salads with 2 bonus days at discounted price .stay healthy every week!"
    },
    {
        _id: 8,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/monthly.jpg?updatedAt=1735428889483",
        title: "MONTHLY MEMBERSHIP!",
        speciality: "BLACK OLIVE",
        price: 2776,
        finalPrice: 2449,
        details: "Monthly membership includes 24 fresh salads, with six bonus days at discounted price.perfect for a healthy lifestyle! "
    }
]

export const saladsIK: product[] = [
    {
        _id: 1,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/paneer.png?updatedAt=1735428955087",
        title: "PANNER MARVELLA",
        speciality: "BLACK OLIVE",
        price: 189,
        finalPrice: 149,
        details: "Exotic vegetable and cottage cheese with cheese dressings garnished with black olives"
    },
    {
        _id: 2,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/power.png?updatedAt=1735428954667",
        title: "POWER PLATINUM",
        speciality: "BLACK OLIVE",
        price: 159,
        finalPrice: 99,
        details: "Steam chickpeas with veggies, mix with pomegranate and cater with indian style red sauce dressing and garnish with coriander"
    },
    {
        _id: 3,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/rich.png?updatedAt=1735428949065",
        title: "RICH DIAMOND",
        speciality: "BLACK OLIVE",
        price: 139,
        finalPrice: 99,
        details: "Sprouted green grams and brown chickpeas cater with indian style red sauce dressing, garnished with sunflower seeds"
    },
    {
        _id: 4,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/mushroom.png?updatedAt=1735428954699",
        title: "MYSTIC MUSHROOM",
        speciality: "BLACK OLIVE",
        price: 189,
        finalPrice: 149,
        details: "Exotic vegetable with mushroom infused in oregano garnished with black olive served with cheese dressing"
    },
    {
        _id: 5,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/corn.png?updatedAt=1735428928947",
        title: "GOLDEN CORN",
        speciality: "BLACK OLIVE",
        price: 99,
        finalPrice: 69,
        details: "American sweet corn with sprinkled freshly ground black pepper and a squeeze of zesty lemon"
    },
    {
        _id: 6,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/mexican.png?updatedAt=1735428942589",
        title: "MEXICAN MAGIC",
        speciality: "BLACK OLIVE",
        price: 159,
        finalPrice: 119,
        details: "Iceberg lettuce and other veggies cater with mexican style dressing, garnished with black olive served with nachos"
    }
]

export const membershipIk: product[] = [
    {
        _id: 7,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/weekly.jpg?updatedAt=1735428889502",
        title: "WEEKLY MEMBERSHIP!",
        speciality: "BLACK OLIVE",
        price: 694,
        finalPrice: 629,
        details: "Weekly membership offers 6 fresh salads with 2 bonus days at discounted price .stay healthy every week!"
    },
    {
        _id: 8,
        image: "https://ik.imagekit.io/vaibhav11/Black%20Olive/monthly.jpg?updatedAt=1735428889483",
        title: "MONTHLY MEMBERSHIP!",
        speciality: "BLACK OLIVE",
        price: 2776,
        finalPrice: 2449,
        details: "Monthly membership includes 24 fresh salads, with six bonus days at discounted price.perfect for a healthy lifestyle! "
    }
]