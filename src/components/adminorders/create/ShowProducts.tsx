"use client"
import { useEffect } from "react"
import { getProducts } from "@/src/actions/Product"
import { handleToast } from "@/src/utility/basic"

const ShowProducts = ({ orderDetails, products, setProducts, setOrderDetails, isMembership, daysOfWeek, setWeeklyPlan }: any) => {

    useEffect(() => {
        const getDetails = async () => {
            if (isMembership) {
                const response = await getProducts("membership");
                let data = response?.membership?.map((m: any) => {
                    const { price, finalPrice } = calculatePrices(m.products, m.discountPercent, m.days);
                    return { ...m, price: price, finalPrice: finalPrice }
                });
                setProducts(data)
            } else {
                const response = await getProducts("salads");
                console.log(response)
                setProducts(response.products)
            }
        }
        getDetails()
    }, [])

    const addProduct = (product: any) => {
        console.log("in")
        console.log(orderDetails.orders.filter((p: any) => p.product == product._id))
        if (orderDetails.orders.filter((p: any) => p.product == product._id).length == 0) {

            if (isMembership) {
                setOrderDetails(((prev: any) => {
                    return {
                        ...prev,
                        orders: [product],
                        discountPercent: product.discountPercent
                    }
                }))
                setWeeklyPlan(initializeWeeklyPlan(product));
            } else {
                setOrderDetails(((prev: any) => {
                    return {
                        ...prev,
                        orders: [...prev.orders, { product: product._id, quantity: 1, title: product.title }]
                    }
                }))
            }



        } else {
            handleToast({ success: false, message: "already added" });
        }

    }

    const calculatePrices = (products: any, discountPercent: any, days: any) => {
        const weeks = days / products.length;
        const price = products.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * weeks;
        const finalPrice = Math.round(products.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * ((100 - discountPercent) / 100)) * weeks;
        return { price, finalPrice };
    }

    const initializeWeeklyPlan = (product: any) => {
        const plan: any = {};
        if (product?.products?.length != 0) {
            daysOfWeek.forEach((day: any, index: any) => {
                plan[day] = product?.products[index % product?.products?.length];
            });
        }
        return plan;
    };

    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: any, idx: any) => (
            <div
                key={idx}
                className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow duration-300 bg-white cursor-pointer"
                onClick={() => addProduct(product)}
            >
                <h1 className="text-lg font-bold text-gray-800 mb-2">{isMembership ? "Membership" : "Product"}</h1>
                <div className="space-y-2 text-gray-600">
                    <p>
                        <span className="font-medium text-gray-800">ID:</span> {product._id}
                    </p>
                    <p>
                        <span className="font-medium text-gray-800">Title:</span> {product.title}
                    </p>
                    <p>
                        <span className="font-medium text-gray-800">Final Price:</span> ₹{product.finalPrice}
                    </p>
                    <p>
                        <span className="font-medium text-gray-800">Availability:</span>{" "}
                        {product.isAvailable ? <span className="text-green-700">Yes</span> : <span className="text-red-700">NO</span>}
                    </p>
                </div>
            </div>
        ))}
    </div>
}

export default ShowProducts;