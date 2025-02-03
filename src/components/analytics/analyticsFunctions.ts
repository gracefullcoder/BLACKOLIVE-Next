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
            `${membership.assignedTo || "unassigned"},` +
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
            csv += `${order._id},${order.user.name},${order.user.email},${order.contact},${address},${order.status},${new Date(order.createdAt).toLocaleDateString()},${formatTime(order.time)},${order.assignedTo || "unassigned"},"${item.product.title}",${item.quantity},${item.product.finalPrice},${item.extraCharge || 0},${total}\n`;
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


export const generateOrderReceipt = (order: any) => {
    let receiptContent = `ORDER RECEIPT\n`;
    receiptContent += `Order ID: ${order._id}\n`;
    receiptContent += `Date: ${new Date(order.createdAt).toLocaleDateString()}\n`;
    receiptContent += `Customer: ${order.user.name}\n`;
    receiptContent += `Contact: ${order.contact}\n`;
    receiptContent += `Address: ${order.address.address}, ${order.address.landmark}, ${order.address.pincode}\n\n`;
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
        receiptContent += `  Total: ₹${itemTotal + (item.extraCharge || 0)}\n\n`;
    });

    receiptContent += `\nSubtotal: ₹${subtotal}\n`;
    receiptContent += `Extra Charges: ₹${totalExtraCharges}\n`;
    receiptContent += `Grand Total: ₹${subtotal + totalExtraCharges}\n`;

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


export const generateMembershipReceipt = (membership: any) => {
    let receiptContent = `MEMBERSHIP RECEIPT\n`;
    receiptContent += `Membership ID: ${membership._id}\n`;
    receiptContent += `Start Date: ${new Date(membership.startDate).toLocaleDateString()}\n`;
    receiptContent += `Customer: ${membership.user.name}\n`;
    receiptContent += `Contact: ${membership.contact}\n`;
    receiptContent += `Address: ${membership.address.address}, ${membership.address.landmark}, ${membership.address.pincode}\n\n`;

    receiptContent += `Membership Details:\n`;
    receiptContent += `${membership.category.title}\n`;
    receiptContent += `Base Price: ₹${membership.category.finalPrice}\n`;
    receiptContent += `Extra Charges: ₹${membership.extraCharge || 0}\n`;
    receiptContent += `Total Amount: ₹${membership.category.finalPrice + (membership.extraCharge ? parseInt(membership.extraCharge) : 0)}\n\n`;
    receiptContent += `Delivery Time: ${membership.time}\n`;
    receiptContent += `Payment Status: ${membership.isPaid ? 'Paid' : 'Pending'}\n`;
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