import UpdateProductForm from '@/src/components/product/UpdateProductForm';

export default async function EditProductPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams

  let productId = params.id || params.Mid;

  if (!productId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <UpdateProductForm productId={productId} isMembership={params.Mid ? true : false} />
    </div>
  );
}
