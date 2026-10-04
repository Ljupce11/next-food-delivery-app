export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="h-screen w-screen overflow-hidden">{children}</main>;
}
