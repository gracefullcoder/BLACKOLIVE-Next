import { NextRequest, NextResponse } from "next/server"
import { createMemberships, createProducts } from "@/src/utility/initDB"

export async function GET(req: NextRequest) {
    // await createProducts()
    // await createMemberships()
    return NextResponse.json({
        message: "Handler"
    })
}