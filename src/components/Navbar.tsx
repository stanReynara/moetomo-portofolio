import Link from "next/link";
import { House, MessagesSquare, ShoppingBag } from "lucide-react";

const links = [
  { href: "/", label: "HOME", Icon: House, color: "btn-primary" },
  { href: "/contact", label: "CONTACT US", Icon: MessagesSquare, color: "btn-secondary" },
  { href: "/shop", label: "SHOP", Icon: ShoppingBag, color: "btn-accent" },
];

export default function Navbar() {
  return (
    <nav aria-label="Main navigation" className="navbar border-b border-base-200 bg-base-100 px-3 py-3 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-3 gap-2 sm:gap-6">
        {links.map(({ href, label, Icon, color }) => (
          <Link key={href} href={href} className={`btn ${color} h-16 min-w-0 flex-col gap-1 rounded-lg px-1 text-xs sm:h-12 sm:flex-row sm:gap-3 sm:px-4 sm:text-sm`}>
            <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.8} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
