import { NextResponse } from "next/server";
import User from "@/src/models/user";
import connectToDatabase from "@/src/lib/ConnectDb";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { id, address } = await req.json();

        const user = await User.findByIdAndUpdate(
            id,
            { $push: { addresses: address } },
            { new: true }
        );

        return NextResponse.json({ success: true, addresses: user.addresses });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Failed to add address" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        await connectToDatabase();
        const { id, addressId, updatedAddress } = await req.json();

        const user = await User.findOneAndUpdate(
            { _id: id, 'addresses._id': addressId },
            {
                $set: {
                    'addresses.$': {
                        ...updatedAddress,
                        _id: addressId
                    }
                }
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: "Address not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, addresses:user.addresses });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Failed to update address" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        await connectToDatabase();
        const { id, addressId } = await req.json();

        const user = await User.findByIdAndUpdate(
            id,
            { $pull: { addresses: { _id: addressId } } },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, addresses: user.addresses });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Failed to delete address" },
            { status: 500 }
        );
    }
}