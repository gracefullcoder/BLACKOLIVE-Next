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