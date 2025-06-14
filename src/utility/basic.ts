import { toast } from "react-toastify";

export const handleResponse = (response: any, toDoFnx: () => any) => {
    if (!response.status || response.status >= 400) toDoFnx()
}

export const handleInputChange = (e: any, setState:any) => {
    const { name, value } = e.target;
    setState((prev: any) => ({ ...prev, [name]: value }));
};

export function openInGoogleMaps(address: string) {
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps?q=${encodedAddress}`;

    window.open(googleMapsUrl, '_blank');
}

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

export const handleApiError = (res: any, error: any, message: string) => {
    return res.json({ success: false, message: error?.message || message })
}

export const handleToast = (data: { success: boolean, message: string, [key: string]: any }, duration: number = 1000, info: boolean = false) => {
    if (info) {
        toast.info(data.message, { autoClose: duration });
    }
    else if (data.success) {
        toast.success(data.message, { autoClose: duration });
    } else {
        toast.error(data.message, { autoClose: duration });
    }
}