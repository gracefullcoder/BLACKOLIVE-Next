import { getServerSession } from "next-auth";
import AuthConfig from "@/src/lib/auth";
import UserProfile from '@/src/components/user/UserProfile';

async function getUser() {
  const session = await getServerSession(AuthConfig);
  console.log(session);

  return session;
}

export default async function Home() {
  const session = await getUser();

  return <UserProfile user={session.user} />;
}