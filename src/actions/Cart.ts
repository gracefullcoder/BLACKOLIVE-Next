"use server"
import User from "../models/user"

export const addToCart = async (userId: string, productId: string, quantity: number) => {
    try {
        console.log("Server")
        const data = await User.findByIdAndUpdate(userId, { $push: { cart: { product: productId, quantity } } }, { new: true });
        console.log(data);
        return { message: "Added To Cart Successfully", success: true }
    } catch (error) {
        console.log(error)
        return { message: "Unable To Add to Cart ", success: false }
    }
}

export const removeFromCart = async (userId: string, productId: string) => {
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { cart: { product: productId } } },
            { new: true }
        );

        if (!user) {
            return { message: "User not found", success: false };
        }

        return { message: "Removed from Cart Successfully", success: true };
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        return { message: "Unable to Remove from Cart", success: false };
    }
};

export const decreaseQuantity = async (userId: string, productId: string) => {
    try {
        const user = await User.findOneAndUpdate(
            {
                _id: userId,
                "cart.product": productId
            },
            {
                $inc: { "cart.$.quantity": -1 }
            },
            {
                new: true
            }
        );

        if (!user) {
            return { message: "Product not found in cart", success: false };
        }

        return { message: "Decreased Quantity", success: true };

    } catch (error) {
        console.error("Error in increaseQuantity:", error);
        return { message: "Unable to increase quantity", success: false };
    }
};

export const increaseQuantity = async (userId: string, productId: string) => {
    try {
        const user = await User.findOneAndUpdate(
            {
                _id: userId,
                "cart.product": productId
            },
            {
                $inc: { "cart.$.quantity": 1 }
            },
            {
                new: true
            }
        );

        if (!user) {
            return { message: "Product not found in cart", success: false };
        }

        return { message: "Increased Quantity", success: true };

    } catch (error) {
        console.error("Error in increaseQuantity:", error);
        return { message: "Unable to increase quantity", success: false };
    }
};