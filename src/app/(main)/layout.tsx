import { auth } from "../../../auth";
import { fetchUserData } from "../lib/data";
import Navbar from "../ui/navbar";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authData = await auth();
  const userData = await fetchUserData(authData?.user?.id || "");
  // console.log("userData", userData);

  return (
    <div className={"flex flex-col"}>
      <Navbar cartData={userData.cart} user={authData?.user} />
      {children}
    </div>
  );
}
