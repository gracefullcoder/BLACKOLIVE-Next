import { sendMail } from "@/src/utility/mail";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name: string = body.name || "Vaibhav";
    const message: string = body.message || "Hello";
    const email: string = body.email || "vaibhavgupta10987@gmail.com";

    await sendMail({message,name,email})

    return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json({ message: "Email sending failed" }, { status: 500 });
  }
}
