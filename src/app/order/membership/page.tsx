// app/order/membership/[id]/page.tsx
import { getMembershipOrder } from '@/src/actions/Order';
import MembershipDetails from '@/src/components/product/MembershipDetails';
import AuthConfig from '@/src/lib/auth';
import { getServerSession } from 'next-auth';



async function MembershipOrderPage({ searchParams }: { searchParams: any }) {
  const param = await searchParams
  console.log(param)
 
  const session = await getServerSession(AuthConfig);
  const membership = await getMembershipOrder(param.id, session.user._id);
  return <MembershipDetails membership={membership} />;
}

export default MembershipOrderPage;

export const dynamic = 'force-dynamic';