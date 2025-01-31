export const handleResponse = (response: any, toDoFnx: () => any) => {
    if (!response.status || response.status >= 400) toDoFnx()
}

export function openInGoogleMaps(address: string) {
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps?q=${encodedAddress}`;

    window.open(googleMapsUrl, '_blank');
}