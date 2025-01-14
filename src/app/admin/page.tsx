import React from 'react'
import Link from 'next/link'

function page() {
  return (
    <div>
      <div>Admin view only</div>
      <Link href={"/admin/orders"}>orders</Link>
      <br />
      <Link href={"/admin/users"}>users</Link>
      <br />
      <Link href={"/admin/products"}>Products</Link>
    </div>
  )
}

export default page