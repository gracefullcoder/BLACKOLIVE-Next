import { formatTime } from "@/src/utility/basic";
export const calculateProRatedRevenue = (membership: any) => {
    if (membership.status !== 'cancelled') {
        return membership.category.finalPrice + (membership.extraCharge ? parseInt(membership.extraCharge) : 0)
    }

    const deliveredDays = membership.deliveryDates.length;
    const totalDays = membership.category.days;
    const proRatedRevenue = (membership.category.finalPrice * deliveredDays) / totalDays;
    return proRatedRevenue;
};

export const downloadMembershipExcel = (filteredMemberships: any) => {
    let csv = 'Membership ID,Full Name,Email,Contact,Address,Category,Status,Assigned To,Start Date,Delivery Time,Note,Delivered Days,Total Days,Price,Extra Price,Final Revenue\n';
    let grandTotal = 0;

    filteredMemberships.forEach((membership: any) => {
        const deliveredDays = membership.deliveryDates.length;
        const totalDays = membership.category.days;
        const revenue = calculateProRatedRevenue(membership);
        const address = `${membership.address.number} ${membership.address.address}, ${membership.address.landmark}, ${membership.address.pincode}`;
        grandTotal += revenue;

        csv += `${membership._id},` +
            `${membership.user.name},` +
            `${membership.user.email},` +
            `${membership.contact},` +
            `"${address}",` +
            `${membership.category.title},` +
            `${membership.status},` +
            `${membership?.assignedTo?.name || "unassigned"},` +
            `${new Date(membership.startDate).toLocaleDateString()},` +
            `${formatTime(membership.time)},` +
            `${membership.message || ""},` +
            `${deliveredDays},` +
            `${totalDays},` +
            `${membership.category.finalPrice},` +
            `${membership.extraCharge || "0"},` +
            `${revenue.toFixed(2)}\n`;
    });

    csv += `,,,,,,,,,,,,,,Grand Total,${grandTotal.toFixed(2)}\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'membership_analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
};

export const downloadExcel = (filteredOrders: any) => {
    let csv = 'Order ID,Customer Name,Customer Email,Mobile Number,Address,Status,Date,Delivery Time,Assigned To,Products,Quantity,Price,Extra Price,Total\n';


    let grandTotal = 0;
    filteredOrders.forEach((order: any) => {
        let orderTotal = 0;
        order.orders.forEach((item: any) => {
            const total = item.quantity * item.product.finalPrice + (item.extraCharge || 0);
            orderTotal += total;
            const address = `${order?.address?.address || ""} ${order?.address?.landmark || ""} ${order?.address?.pincode || 0}`.replaceAll(",", "|")
            console.log(address)
            const hrs = parseInt(order.time.slice(0, 2))
            csv += `${order._id},${order.user.name},${order.user.email},${order.contact},${address},${order.status},${new Date(order.createdAt).toLocaleDateString()},${formatTime(order.time)},${order?.assignedTo?.name || "unassigned"},"${item.product.title}",${item.quantity},${item.product.finalPrice},${item.extraCharge || 0},${total}\n`;
        });
        csv += `,,,,,,,,,,,,Order Total: ${orderTotal}\n`;
        grandTotal += orderTotal;
    });

    csv += `,,,,,,,,,,,,Grand Total: ${grandTotal}\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'order_analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
};


export const generateOrderTXTReceipt = (order: any) => {
    let receiptContent = `ORDER RECEIPT\n`;
    receiptContent += `Order ID: ${order._id}\n`;
    receiptContent += `Date: ${new Date(order.createdAt).toLocaleDateString()}\n`;
    receiptContent += `Customer: ${order.user.name}\n`;
    receiptContent += `Contact: ${order.contact}\n`;
    receiptContent += `Address: ${order.address.address}, ${order.address.landmark}, ${order.address.pincode}\n`;
    receiptContent += `Assigned To: ${order?.assignedTo?.name || "Not delivered"}\n\n`;
    receiptContent += `Items:\n`;

    let subtotal = 0;
    let totalExtraCharges = 0;

    order.orders.forEach((item: any) => {
        const itemTotal = item.product.finalPrice * item.quantity;
        subtotal += itemTotal;
        totalExtraCharges += item.extraCharge || 0;

        receiptContent += `${item.product.title}\n`;
        receiptContent += `  Quantity: ${item.quantity} × ₹${item.product.finalPrice}\n`;
        receiptContent += `  Extra Charges: ₹${item.extraCharge || 0}\n`;
        receiptContent += `  Total: ₹${itemTotal + (item.extraCharge || 0)}\n`;
    });

    receiptContent += `\nSubtotal: ₹${subtotal}\n`;
    receiptContent += `Extra Charges: ₹${totalExtraCharges}\n`;
    receiptContent += `Grand Total: ₹${subtotal + totalExtraCharges}\n`;
    receiptContent += `Payment Status: ${order?.isPaid ? 'PAID' : 'COD'}\n`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-receipt-${order._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const calculateContentHeight = (order: any, fontSize: number = 10) => {
    let height = 0;
    
    // Header space (BLACK OLIVE + padding)
    height += 30 + 18;
    
    // Date and time
    height += 10;
    
    // First dotted line + padding
    height += 15;
    
    // Customer details (name, phone)
    height += 30;
    
    // Address
    const fullAddress = `${order.address.number}, ${order.address.address}`;
    const wrappedAddress = wrapText(fullAddress, 230, fontSize);
    height += wrappedAddress.length * 12;
    
    // Landmark and pincode
    height += 24;
    
    // Status
    height += 25;
    
    // Table headers + padding
    height += 30;
    
    // Calculate items height
    order.orders.forEach((item: any) => {
        const wrappedTitle = wrapText(item.product.title, 100, fontSize);
        height += wrappedTitle.length * 12 + 5;
    });
    
    // Total section
    height += 40;
    
    // Footer
    height += 35;
    
    // Add padding for safety
    height += 30;
    
    return height;
};

const wrapText = (text: string, maxWidth: number, fontSize: number) => {
    const averageCharWidth = fontSize * 0.5;
    const charsPerLine = Math.floor(maxWidth / averageCharWidth);
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + ' ' + word).length <= charsPerLine) {
            currentLine += (currentLine ? ' ' : '') + word;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    });
    if (currentLine) lines.push(currentLine);

    return lines;
};

const drawDottedLine = (page: any, startX: number, endX: number, y: number, gap: number = 5) => {
    for (let x = startX; x < endX; x += gap * 2) {
        page.drawLine({ start: { x, y }, end: { x: x + gap, y }, thickness: 1, color: rgb(0, 0, 0) });
    }
};

export const generateOrderReceipt = async (order: any) => {
    const contentHeight = calculateContentHeight(order);
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([288, contentHeight]); // 4 inches width, dynamic height
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 30;

    const drawText = (text: string, x: number, y: number, options: any = {}) => {
        page.drawText(text, {
            x,
            y,
            font: options.bold ? boldFont : font,
            size: options.size || 10,
            color: rgb(0, 0, 0)
        });
    };

    // Header
    drawText("BLACK OLIVE", 60, y, { bold: true, size: 25 });
    y -= 18;

    const date = new Date(order.createdAt);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear().toString().slice(-2)}`;
    drawText(`Date: ${formattedDate}`, 30, y);
    drawText(
        `Time: ${parseInt(order.time) > 12
            ? `${parseInt(order.time) - 12} PM`
            : `${parseInt(order.time) === 12 ? 12 : parseInt(order.time) === 0 ? 12 : parseInt(order.time)} AM`
        }`,
        180, y
    );
    y -= 10;

    drawDottedLine(page, 20, 268, y);
    y -= 15;

    // Customer details
    drawText(`Name: ${order.user.name}`, 20, y);
    y -= 15;
    drawText(`Phone: ${order.contact}`, 20, y);
    y -= 15;

    // Address handling with word wrap
    const fullAddress = `${order.address.number}, ${order.address.address}`;
    const wrappedAddress = wrapText(fullAddress, 230, 10);
    drawText('Address:', 20, y);
    wrappedAddress.forEach((line, index) => {
        drawText(line, 60, y - (index * 12));
    });
    y -= wrappedAddress.length * 12;

    drawText(`LandMark: ${order.address.landmark}`, 20, y);
    y -= 12;
    drawText(`Pincode: ${order.address.pincode}`, 20, y);
    y -= 15;

    drawText(`Status:${(order?.assignedTo?.name || ' ') + ' ' + order.status}`, 20, y);
    y -= 10;

    // Separator line
    drawDottedLine(page, 20, 268, y);
    y -= 15;

    // Table headers
    drawText("item", 20, y);
    drawText("qty", 140, y);
    drawText("rate", 170, y);
    drawText("ext", 210, y);
    drawText("amt", 240, y);
    y -= 15;

    // Order items
    let subtotal = 0;
    order.orders.forEach((item: any) => {
        const itemTotal = item.product.finalPrice * item.quantity + (item?.extraCharge || 0);
        subtotal += itemTotal;

        const wrappedTitle = wrapText(item.product.title, 100, 10);
        wrappedTitle.forEach((line, index) => {
            drawText(line, 20, y - (index * 12));
        });

        drawText(item.quantity.toString(), 140, y);
        drawText(item.product.finalPrice.toString(), 170, y);
        drawText(item?.extraCharge?.toString() || '0', 210, y);
        drawText(itemTotal.toString(), 240, y);

        y -= (wrappedTitle.length * 12 + 5);
    });

    // Final separator and total
    page.drawLine({ start: { x: 20, y }, end: { x: 268, y }, thickness: 1, color: rgb(0, 0, 0) });
    y -= 15;
    drawText("Total", 20, y);
    drawText(subtotal.toString(), 230, y);
    y -= 10;
    
    // Footer
    drawDottedLine(page, 20, 268, y);
    y -= 15;
    drawText(order?.category ? "Membership" : "Order", 20, y);
    drawText(order.isPaid ? "PAID" : "COD", 220, y);
    y -= 5;
    drawDottedLine(page, 20, 268, y);

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${order._id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};




export const generateMembershipReceipt = (membership: any) => {
    let receiptContent = `MEMBERSHIP RECEIPT\n`;
    receiptContent += `Membership ID: ${membership._id}\n`;
    receiptContent += `Start Date: ${new Date(membership.startDate).toLocaleDateString()}\n`;
    receiptContent += `Customer: ${membership.user.name}\n`;
    receiptContent += `Contact: ${membership.contact}\n`;
    receiptContent += `Address: ${membership.address.address}, ${membership.address.landmark}, ${membership.address.pincode}\n`;
    receiptContent += `Assigned To: ${membership?.assignedTo?.name || "Not delivered"}\n\n`;

    receiptContent += `Membership Details:\n`;
    receiptContent += `${membership.category.title}\n`;
    receiptContent += `Base Price: ₹${membership.category.finalPrice}\n`;
    receiptContent += `Extra Charges: ₹${membership.extraCharge || 0}\n`;
    receiptContent += `Total Amount: ₹${membership.category.finalPrice + (membership.extraCharge ? parseInt(membership.extraCharge) : 0)}\n\n`;
    receiptContent += `Delivery Time: ${membership.time}\n`;
    receiptContent += `Payment Status: ${membership?.isPaid ? 'PAID' : 'COD'}\n`;
    receiptContent += `Membership Status: ${membership.status}\n`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `membership-receipt-${membership._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};