import { auth } from "../../../auth";
import { fetchUserData } from "../lib/data";
import type { AdvancedUser } from "../lib/definitions";
import Navbar from "../ui/navbar";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authData = await auth();
  const userData: AdvancedUser | undefined = await fetchUserData(authData?.user?.id || null);

  return (
    <div className={"flex flex-col"}>
      <Navbar user={userData} />
      {children}
    </div>
  );
}
