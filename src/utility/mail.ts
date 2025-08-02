import nodemailer from "nodemailer";
import { Resend } from 'resend';

export const sendMail = async (emailData: any) => {
    try {

        const mailId = process.env.EMAIL_USER as string;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        console.log(emailData);

        const res = await transporter.sendMail({
            from: `"Black Olive ${mailId}`,
            to: emailData.email,
            subject: emailData.subject,
            html: emailData.html
        });

        console.log(res)

    } catch (error) {
        console.log(error);
        return { success: false }
    }
}

export const resendMail = async (emailData: any) => {
    const resendKey = process.env.RESEND_API_KEY;
    const resend = new Resend(resendKey);

    try {
        const { data, error } = await resend.emails.send({
            from: 'Black Olive <order@blackolive.in>',
            to: [emailData.email],
            subject: emailData.subject,
            html: emailData.html,
        });

        if (error) {
            console.log(error);
            return { success: false }
        }

        return { success: true, messageId: data?.id || "" };
    } catch (error) {
        console.log(error);
    }
}

export const orderEmailTemplate = (orderDetails: any) => {
    const { userName, orderId, address, contact, time, orderItems, totalAmount } = orderDetails;

    const itemsHTML = orderItems
        .map(
            (item: { title: string; quantity: number; priceCharged: number }) => `
        <tr>
          <td>${item.title}</td>
          <td>${item.quantity}</td>
          <td>₹${item.priceCharged}</td>
        </tr>`
        )
        .join("");

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                margin: auto;
            }
            .header {
                text-align: center;
                color: #333;
            }
            .order-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }
            .order-table th, .order-table td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
            }
            .order-table th {
                background: #007bff;
                color: white;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2 class="header">🛍️ Order Confirmation</h2>
            <p>Dear <strong>${userName}</strong>,</p>
            <p>Thank you for shopping with us! Your order has been placed successfully.</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Delivery Address:</strong> ${address.number + ', ' + address.address + ', ' + address.landmark + ', ' + address.pincode}</p>
            <p><strong>Contact:</strong> ${contact}</p>
            <p><strong>Expected Delivery Time:</strong> ${time}</p>

            <h3>📦 Ordered Items:</h3>
            <table class="order-table">
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
                ${itemsHTML}
            </table>

            <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br>
            <strong>Your Black Olive</strong></p>

            <div class="footer">
                <p>📞 Contact Support: <a href="mailto:blackolive0123@gmail.com">blackolive.in</a></p>
                <p>© 2025 Black Olive. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;
};

export const membershipEmailTemplate = (orderDetails: any) => {
    const { userName, orderId, address, contact, time,displayTime, orderItems, totalPrice } = orderDetails;

    const itemsHTML = orderItems
        .map(
            (item: { product: string; price: number; days: number }) => `
        <tr>
          <td>${item.product}</td>
          <td>₹${item.price}</td>
          <td>${item.days}</td>
        </tr>`
        )
        .join("");

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                margin: auto;
            }
            .header {
                text-align: center;
                color: #333;
            }
            .order-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }
            .order-table th, .order-table td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
            }
            .order-table th {
                background: #007bff;
                color: white;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2 class="header">🛍️ Order Confirmation</h2>
            <p>Dear <strong>${userName}</strong>,</p>
            <p>Thank you for shopping with us! Your order has been placed successfully.</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Delivery Address:</strong> ${address.number + ', ' + address.address + ', ' + address.landmark + ', ' + address.pincode}</p>
            <p><strong>Contact:</strong> ${contact}</p>
            <p><strong>Expected Delivery Time:</strong> ${displayTime || time}</p>

            <h3>📦 Ordered Items:</h3>
            <table class="order-table">
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Days</th>
                </tr>
                ${itemsHTML}
            </table>

            <p><strong>Total Amount:</strong> ₹${totalPrice}</p>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br>
            <strong>Your Black Olive</strong></p>

            <div class="footer">
                <p>📞 Contact Support: <a href="mailto:blackolive0123@gmail.com">blackolive.in</a></p>
                <p>© 2025 Black Olive. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;
};