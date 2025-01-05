import Navbar from "../ui/navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={"flex flex-col"}>
      <Navbar />
      {children}
    </div>
  );
}
