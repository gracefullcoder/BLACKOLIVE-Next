import { NextRequest, NextResponse } from 'next/server';
import User from '@/src/models/user';
import connectToDatabase from '@/src/lib/ConnectDb';

export async function GET() {
    try {
        await connectToDatabase();
        const users = await User.find({})
            .select('name email profileImage isAdmin contact isDelivery');

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
    try {
        await connectToDatabase();
        const { userId } = await params;
        const { isAdmin, role } = await request.json();

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role, isAdmin },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}
