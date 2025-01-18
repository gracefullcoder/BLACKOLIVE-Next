"use client"
import { useEffect } from "react"
import { getProducts } from "@/src/actions/Product"

const ShowProducts = ({ products, setProducts, setOrderDetails, isMembership }: any) => {
    useEffect(() => {
        const getDetails = async () => {
            if (isMembership) {
                const response = await getProducts("membership");
                console.log(response)
                setProducts(response.membership)
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
        setOrderDetails(((prev: any) => {
            return {
                ...prev,
                orders: [...prev.orders, { product: product._id, quantity: 1, title: product.title }]
            }
        }))
    }

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