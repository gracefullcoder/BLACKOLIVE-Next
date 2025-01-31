import ActiveOrders from '@/src/components/adminorders/manage/ActiveOrders'
import React from 'react'

function page() {
  return (
    <ActiveOrders onlyAssigned={true} />
  )
}

export default page