import { Suspense } from "react";
import { fetchUserData } from "../../lib/data";
import { getCurrentUser } from "../../lib/session";
import Navbar from "../../ui/navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={"flex flex-col"}>
      <Suspense fallback={<Navbar isLoading />}>
        <NavbarWithUser />
      </Suspense>
      <main className="flex flex-col">{children}</main>
    </div>
  );
}

async function NavbarWithUser() {
  const user = await getCurrentUser();
  const userData = await fetchUserData(user?.id ?? null);
  return <Navbar user={userData} />;
}
