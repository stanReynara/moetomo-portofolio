import Logo from "@components/Logo";
import Navbar from "@components/Navbar";
import { CartProvider } from "@/components/CartProvider";
import CartModal from "@/components/CartModal";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <Logo />
      <main>
        <CartProvider>
          {children}
          <CartModal />
        </CartProvider>
      </main>
    </>
  );
}
