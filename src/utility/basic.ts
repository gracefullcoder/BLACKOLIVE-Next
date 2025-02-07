export const handleResponse = (response: any, toDoFnx: () => any) => {
    if (!response.status || response.status >= 400) toDoFnx()
}

export function openInGoogleMaps(address: string) {
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps?q=${encodedAddress}`;

    window.open(googleMapsUrl, '_blank');
}

export const formatTime = (time:any) => {
    if (!time) return "";
    const [hour] = time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:00 ${period}`;
};

export const openRouteInMaps = (orders: any[]) => {
    if (!orders || orders.length === 0) {
        return;
    }

    const locations = orders.map(order =>
        `${order.address.number}, ${order.address.address}, ${order.address.landmark}, ${order.address.pincode}`
    );

    const googleMapsUrl = `https://www.google.com/maps/dir/${locations.join("/")}`;

    window.open(googleMapsUrl, "_blank");
};
