import React from 'react'
import Link from 'next/link'

function page() {
  return (
    <div>
        <Link href={"/admin/create/order"}>create order</Link>
        <br />
        <br />
        
        <Link href={"/admin/create/membership"}>Create Membership</Link>
    </div>
  )
}

export default page