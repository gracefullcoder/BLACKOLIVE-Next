import ActiveOrders from "@/src/components/adminorders/manage/ActiveOrders";


export default function OrdersPage() {
    return (<ActiveOrders onlyAssigned={false} />)
}
