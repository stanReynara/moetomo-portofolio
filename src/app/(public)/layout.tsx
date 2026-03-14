import Logo from "@components/Logo";
import Navbar from "@components/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <Logo />
      <main>{children}</main>
    </>
  );
}
