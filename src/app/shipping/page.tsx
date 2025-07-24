function Shipping() {
    return (
        <div className="bg-gray-50 p-6 md:p-12 lg:p-16">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 md:p-8 lg:p-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 text-center mb-6">
                    SHIPPING POLICY
                </h2>

                <p className="text-gray-600 text-base md:text-lg lg:text-xl mb-4">
                    Our Shipping Policy ensures that your order is delivered to you in a timely and efficient manner. We understand the importance of receiving your products promptly, and we strive to provide a seamless shipping experience for all our customers.
                </p>

                <ol className="list-decimal list-inside text-gray-600 text-base md:text-lg lg:text-xl space-y-4">
                    <li>
                        We currently deliver only in <strong>Surat</strong>. During checkout, our system will inform you if we deliver to your area. If delivery is available, we commit to delivering within the promised time slots. In rare cases where delivery cannot be made within the specified time, we ensure fair and timely communication. If required, we offer refunds as per the customer's request.
                    </li>
                    <li>
                        Our deliveries are scheduled <strong>Monday to Friday</strong> only. We operate in the following three time slots:
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
                            <li><strong>Slot 1:</strong> 11:00 AM – 1:00 PM (Order before 10:00 AM)</li>
                            <li><strong>Slot 2:</strong> 2:00 PM – 3:30 PM (Order before 1:00 PM)</li>
                            <li><strong>Slot 3:</strong> 4:30 PM – 6:00 PM (Order before 4:00 PM)</li>
                        </ul>
                        Orders placed after <strong>4:00 PM</strong> will be scheduled for the <strong>next day</strong>.
                    </li>
                    <li>
                        <strong>Cancellation:</strong> Orders can be cancelled <strong>only if</strong> we are unable to deliver in the selected time slot. Once an order is accepted for delivery and is on its way, cancellation is not permitted unless due to unforeseen circumstances from our side.
                        <br /><br />
                        <strong>Refund:</strong> If we fail to deliver within the committed time window and you're not satisfied with our resolution, we offer a fair refund process. Refunds will be initiated upon request in such cases and processed promptly.
                    </li>
                    <li>
                        We work with trusted local delivery partners experienced in handling delicate and perishable items, ensuring they arrive in the best possible condition.
                    </li>
                    <li>
                        Delivery charges vary based on your area and will be displayed clearly during checkout before payment. We aim to keep our delivery rates fair and competitive.
                    </li>
                    <li>
                        If you have any questions or concerns regarding your shipment, our customer support team is always ready to assist you. We are committed to excellent service and transparency.
                    </li>
                </ol>

                <p className="text-gray-600 text-base md:text-lg lg:text-xl mt-6">
                    Thank you for choosing Black Olive for your healthy and delicious meals. We appreciate your trust and will continue to offer reliable deliveries, high-quality products, and great service.
                </p>
            </div>
        </div>
    );
}

export default Shipping;
