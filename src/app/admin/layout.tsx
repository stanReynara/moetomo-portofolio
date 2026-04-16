import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Menu,
  Palette
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-200/30">
      {/* --- TOP NAVBAR --- */}
      <header className="navbar bg-base-100 sticky top-0 z-50 border-b border-base-200 px-4 lg:px-8">
        
        {/* Left: Brand & Mobile Menu */}
        <div className="navbar-start">
          {/* Mobile Dropdown */}
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden mr-2">
              <Menu className="h-5 w-5" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200"
            >
              <li><Link href="/admin"><LayoutDashboard className="w-4 h-4 mr-2"/> Dashboard</Link></li>
              <li><Link href="/admin/orders"><ShoppingCart className="w-4 h-4 mr-2"/> Orders</Link></li>
              <li><Link href="/admin/items"><Package className="w-4 h-4 mr-2"/> Items</Link></li>
              <li><Link href="/admin/artists"><Users className="w-4 h-4 mr-2"/> Artists</Link></li>
            </ul>
          </div>
          
          {/* Brand Logo */}
          <Link href="/admin" className="text-xl font-bold tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary text-primary-content p-1.5 rounded-md">
              <Palette className="w-5 h-5" />
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            <li>
              <Link href="/admin" className="hover:bg-base-200 font-medium">
                <LayoutDashboard className="w-4 h-4 mr-1"/> Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className="hover:bg-base-200 font-medium">
                <ShoppingCart className="w-4 h-4 mr-1"/> Orders
              </Link>
            </li>
            <li>
              <Link href="/admin/items" className="hover:bg-base-200 font-medium">
                <Package className="w-4 h-4 mr-1"/> Items
              </Link>
            </li>
            <li>
              <Link href="/admin/artists" className="hover:bg-base-200 font-medium">
                <Users className="w-4 h-4 mr-1"/> Artists
              </Link>
            </li>
          </ul>
        </div>

        {/* Right: User Actions & Profile */}
        <div className="navbar-end gap-2">
          {/* Quick Settings Icon */}
          {/* <Link href="/admin/settings" className="btn btn-ghost btn-circle hidden sm:flex">
            <Settings className="w-5 h-5" />
          </Link> */}
          
          {/* User Profile Dropdown (DaisyUI structure) */}
          {/* Note: If you have installed the Shadcn DropdownMenu, you can easily swap this block out */}
          {/* <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-9 rounded-full ring-1 ring-base-content/10">
                <Image 
                  className="w-full h-full rounded-full" 
                  fill
                  unoptimized
                  alt="Admin Avatar" 
                  src="https://ui-avatars.com/api/?name=Admin&background=random" 
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200"
            >
              <li className="menu-title px-4 py-2 text-xs opacity-60">My Account</li>
              <li><Link href="/admin/profile">Profile</Link></li>
              <li><Link href="/admin/settings">Settings</Link></li>
              <div className="divider my-0"></div>
              <li>
                <button className="text-error hover:bg-error/10">
                  <LogOut className="w-4 h-4 mr-2"/> Logout
                </button>
              </li>
            </ul>
          </div> */}
        </div>
      </header>

      {/* --- MAIN CONTENT INJECTION --- */}
      {/* The AdminDashboard page and others will be rendered inside this main tag */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}