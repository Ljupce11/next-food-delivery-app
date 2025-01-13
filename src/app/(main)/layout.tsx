import { auth } from "../../../auth";
import Navbar from "../ui/navbar";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authData = await auth();
  return (
    <div className={"flex flex-col"}>
      <Navbar user={authData?.user} />
      {children}
    </div>
  );
}
