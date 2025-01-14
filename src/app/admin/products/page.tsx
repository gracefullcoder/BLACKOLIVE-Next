import React from 'react'
import Link from 'next/link'

function Page() {
  return (
    <div>
      ALL Produ
      <br />
      <Link href={"/admin/products/add"}>Add Products</Link>  
    </div>
  )
}

export default Page