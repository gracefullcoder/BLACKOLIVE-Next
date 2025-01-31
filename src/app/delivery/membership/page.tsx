import ActiveMembership from '@/src/components/adminorders/manage/ActiveMembership'
import React from 'react'

function page() {
  return (
    <ActiveMembership onlyAssigned={true} />
  )
}

export default page