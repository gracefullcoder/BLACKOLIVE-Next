import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/src/lib/ConnectDb';
import Product from '@/src/models/product';
import MembershipProduct from '@/src/models/membershipproducts';
import Feature from '@/src/models/extraFeatures';

const calculateMembershipPrices = (products: any, discountPercent: number, days: number) => {
  const weeks = days / products?.length;
  const base = products.reduce((sum: number, curr: any) => sum + curr.finalPrice, 0);
  const price = base * weeks;
  const finalPrice = Math.round(base * ((100 - discountPercent) / 100)) * weeks;
  return { price, finalPrice };
};

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { productData, isMembership, pincode } = await req.json();

    let totalAmount = 0;
    let productDetails;

    if (isMembership) {
      const productDetailsUnsorted = await Product.find({ _id: { $in: productData?.productIds } }).select("title price finalPrice");
      const membershipDetails = await MembershipProduct.findById(productData?.membershipId);

      if (!membershipDetails) {
        return NextResponse.json({ success: false, message: 'Membership not found' }, { status: 404 });
      }

      totalAmount = calculateMembershipPrices(
        productDetailsUnsorted,
        membershipDetails.discountPercent,
        membershipDetails.days
      ).finalPrice;

      productDetails = productData.productIds.map((id: any) => {
        const data = productDetailsUnsorted.find((prod: any) => prod._id.toString() === id.toString());
        return { ...data._doc, product: data._id };
      });

    } else {
      const productIds = productData.map((item: any) => item?.product?._id);
      const productDetailsDB = await Product.find({
        _id: { $in: productIds },
        isAvailable: true,
      }).select("title finalPrice");

      productDetails = productDetailsDB.map((prod: any) => {
        const product = productData.find((item: any) => item?.product?._id.toString() === prod._id.toString());
        return {
          product: prod._id,
          title: prod.title,
          priceCharged: prod.finalPrice,
          quantity: product.quantity,
        };
      });

      totalAmount += productDetails.reduce((sum: number, item: any) => sum + item.priceCharged * item.quantity, 0);

      const feature = await Feature.findOne({ "pincodes.pincode": pincode }, { pincodes: 1 });
      const deliveryData = feature?.pincodes?.find((pin: any) => pin?.pincode === pincode);

      if (!deliveryData) {
        return NextResponse.json({ success: false, message: "Not Deliverable in your Area" }, { status: 400 });
      }

      totalAmount += deliveryData.deliveryCharge;
    }

    return NextResponse.json({
      success: true,
      totalAmount,
      productDetails: JSON.parse(JSON.stringify(productDetails))
    });
  } catch (error) {
    console.error("Error calculating order cost:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}