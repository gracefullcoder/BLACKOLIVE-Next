
export const getTodayItem = (membership: any, populated: boolean) => {
    const deliveredDays = membership?.deliveryDates?.length || 0;
    const postponedDays = membership?.postponedDates?.length || 0;
    const postponedProducts = membership?.postponedItems?.length || 0;
    const totalDays = membership?.days;
    let currentProduct;
    let isItemPostponed = true;

    const todayDay = new Date();
    const offset = Math.max(todayDay.getUTCDay() - 1, 0); //sunday ka delivery on monday also used mod tho staurday ka on monday

    if (postponedProducts > 0 && (deliveredDays + postponedProducts) == totalDays) {
        const productId = membership.postponedItems[0];
        if (populated) currentProduct = membership?.products?.find((plan: any) => plan?.product?._id == productId).product;
        else currentProduct = membership?.products?.find((plan: any) => plan?.product == productId);
    } else {
        isItemPostponed = false;

        if (membership?.products?.length != 5) currentProduct = membership?.products[(deliveredDays + postponedDays) % membership?.products?.length]?.product;
        else currentProduct = membership?.products[(offset) % membership?.products?.length]?.product;
    }

    return { currentProduct, isItemPostponed };
}

export type FilterOptionsType = {
    slot: string,
    startDate: string,
    endDate: string,
    search: string,
    onlyAssigned: boolean
}

export let intialFilterOptions: FilterOptionsType = {
    slot: "all",
    startDate: "",
    endDate: "",
    search: "",
    onlyAssigned: false
}

export const calculatePrices = (products: any, discountPercent: any, days: any) => {
    const weeks = days / products.length;
    const price = products.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * weeks;
    const finalPrice = Math.round(products.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * ((100 - discountPercent) / 100)) * weeks;
    return { price, finalPrice };
}

export const mapProducts = (data: any) => {
    const productMapping = new Map();
    const membershipMapping = new Map();

    let mappedOrders = data.map((membership: any) => {
        const { currentProduct } = getTodayItem(membership, true);

        const { price, finalPrice } = calculatePrices(membership.products, membership.discountPercent, membership.days);

        let membershipId = membership.category._id;
        if (membershipMapping.has(membershipId)) {
            const prodDet = membershipMapping.get(membershipId);
            membershipMapping.set(membershipId, {
                ...prodDet,
                quantity: (prodDet?.quantity || 0) + 1,
            });
        } else {
            membershipMapping.set(membershipId, {
                quantity: 1,
                name: membership.category.title
            });
        }

        let productId = currentProduct?._id;

        if (productMapping.has(productId)) {
            const prodDet = productMapping.get(productId);
            productMapping.set(productId, {
                ...prodDet,
                quantity: (prodDet?.quantity || 0) + 1,
            });
        } else {
            productMapping.set(productId, {
                quantity: 1,
                name: currentProduct.title
            });
        }

        return {
            ...membership,
            currentProduct,
            price,
            finalPrice
        };
    });

    return {
        membershipMapping,
        productMapping,
        mappedOrders
    };
};

export const applyIndividualFilters = (target: string, data: any, filterOptions: FilterOptionsType, userId?: any) => {
    let filtered = [...data];

    if (target == "slot") {
        const slot = filterOptions.slot;
        if (slot !== "all") {
            filtered = filtered.filter((membership: any) => {
                const time = parseInt(membership.time);
                switch (slot) {
                    case 'morning':
                        return time >= 0 && time < 12;
                    case 'afternoon':
                        return time >= 12 && time < 15;
                    case 'evening':
                        return time >= 15 && time < 17;
                    case 'night':
                        return time >= 17 && time < 24;
                    default:
                        return true;
                }
            });
        }

    }
    else if (target == "search") {
        let search = filterOptions.search;
        if (search) {
            filtered = filtered.filter((membership: any) =>
                membership?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                membership?.user.email.toLowerCase().includes(search.toLowerCase()) ||
                membership?.contact?.toString().includes(search) ||
                membership?.adminOrder?.customerName?.toString().includes(search)
            );
        }
    }
    else if (target == "onlyAssigned") {
        if (filterOptions.onlyAssigned) filtered = filtered.filter((order: any) => order.assignedTo?._id == userId)
    }
    else {
        let startDate = filterOptions.startDate;
        let endDate = filterOptions.endDate;
        if (startDate || endDate) {
            filtered = filtered.filter((membership: any) => {
                const membershipDate = new Date(membership.startDate);
                if (startDate && endDate) {
                    return membershipDate >= new Date(startDate) && membershipDate <= new Date(endDate);
                } else if (startDate) {
                    return membershipDate >= new Date(startDate);
                } else if (endDate) {
                    return membershipDate <= new Date(endDate);
                }
                return true;
            });
        }
    }

    return mapProducts(filtered);
};

export const applyFilters = (data: any, filterOptions: FilterOptionsType, userId?: any) => {
    let filtered = [...data];

    if (filterOptions.onlyAssigned) filtered = filtered.filter((order: any) => order.assignedTo?._id == userId)

    const slot = filterOptions.slot;

    if (slot !== "all") {
        filtered = filtered.filter((membership: any) => {
            const time = parseInt(membership.time);
            switch (slot) {
                case 'morning':
                    return time >= 0 && time < 12;
                case 'afternoon':
                    return time >= 12 && time < 15;
                case 'evening':
                    return time >= 15 && time < 17;
                case 'night':
                    return time >= 17 && time < 24;
                default:
                    return true;
            }
        });
    }

    let search = filterOptions.search;

    if (search) {
        filtered = filtered.filter((membership: any) =>
            membership?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            membership?.user.email.toLowerCase().includes(search.toLowerCase()) ||
            membership?.contact?.toString().includes(search) ||
            membership?.adminOrder?.customerName?.toString().includes(search)
        );
    }

    let startDate = filterOptions.startDate;
    let endDate = filterOptions.endDate;
    if (startDate || endDate) {
        filtered = filtered.filter((membership: any) => {
            const membershipDate = new Date(membership.startDate);
            if (startDate && endDate) {
                return membershipDate >= new Date(startDate) && membershipDate <= new Date(endDate);
            } else if (startDate) {
                return membershipDate >= new Date(startDate);
            } else if (endDate) {
                return membershipDate <= new Date(endDate);
            }
            return true;
        });
    }

    return mapProducts(filtered);
};