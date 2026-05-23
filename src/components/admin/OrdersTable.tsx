"use client";

import { useState, useMemo } from "react";
import { Eye, Search, Filter, TrendingUp } from "lucide-react";

// --- Types ---
type Artist = { id: number; name: string };
type Item = {
  id: number;
  name: string;
  imageUrl: string | null;
  itemArtists: { artist: Artist }[];
};
type OrderItem = { id: number; quantity: number; priceAtTime: number; item: Item };
type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  notes: string | null;
  status: string;
  createdAt: Date;
  orderItems: OrderItem[];
};

export default function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [itemFilter, setItemFilter] = useState("ALL");
  const [artistFilter, setArtistFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- Utilities ---
  const formatIDR = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(date));

  const getOrderTotal = (orderItems: OrderItem[]) =>
    orderItems.reduce((sum, current) => sum + current.priceAtTime * current.quantity, 0);

  // --- Filter Extraction ---
  // Generate unique lists for the dropdowns
  const uniqueItems = useMemo(() => {
    const itemsMap = new Map<number, Item>();
    orders.forEach((o) => o.orderItems.forEach((oi) => itemsMap.set(oi.item.id, oi.item)));
    return Array.from(itemsMap.values());
  }, [orders]);

  const uniqueArtists = useMemo(() => {
    const artistsMap = new Map<number, Artist>();
    orders.forEach((o) =>
      o.orderItems.forEach((oi) =>
        oi.item.itemArtists.forEach((ia) => artistsMap.set(ia.artist.id, ia.artist))
      )
    );
    return Array.from(artistsMap.values());
  }, [orders]);

  // --- Core Filtering Logic ---
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

      const matchesItem =
        itemFilter === "ALL" || order.orderItems.some((oi) => oi.item.id.toString() === itemFilter);

      const matchesArtist =
        artistFilter === "ALL" ||
        order.orderItems.some((oi) =>
          oi.item.itemArtists.some((ia) => ia.artist.id.toString() === artistFilter)
        );

      return matchesSearch && matchesStatus && matchesItem && matchesArtist;
    });
  }, [orders, searchTerm, statusFilter, itemFilter, artistFilter]);

  // --- Sales Summary Aggregation (Feature 1) ---
  const itemSalesStats = useMemo(() => {
    const stats: Record<number, { name: string; qty: number; revenue: number }> = {};
    filteredOrders.forEach((o) => {
      o.orderItems.forEach((oi) => {
        if (!stats[oi.item.id]) {
          stats[oi.item.id] = { name: oi.item.name, qty: 0, revenue: 0 };
        }
        stats[oi.item.id].qty += oi.quantity;
        stats[oi.item.id].revenue += oi.quantity * oi.priceAtTime;
      });
    });
    return Object.values(stats).sort((a, b) => b.qty - a.qty); // Sort by highest quantity
  }, [filteredOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    // await fetch('/api/orders', { method: 'PATCH', body: JSON.stringify({ id: orderId, status: newStatus }) });
  };

  const statusColors: Record<string, string> = {
    PENDING: "badge-warning",
    CONTACTED: "badge-info",
    COMPLETED: "badge-success",
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 shadow-xl rounded-2xl">
          <div className="stat-title">Filtered Orders</div>
          <div className="stat-value">{filteredOrders.length}</div>
        </div>
        <div className="stat bg-base-100 shadow-xl rounded-2xl">
          <div className="stat-title">Items Sold (Filtered)</div>
          <div className="stat-value">
            {filteredOrders.reduce((acc, o) => acc + o.orderItems.reduce((sum, oi) => sum + oi.quantity, 0), 0)}
          </div>
        </div>
        <div className="stat bg-base-100 shadow-xl rounded-2xl flex justify-between items-center">
          <div>
            <div className="stat-title">Aggregate Sales</div>
            <button 
              className="btn btn-sm btn-primary mt-2"
              onClick={() => (document.getElementById("stats_modal") as HTMLDialogElement)?.showModal()}
            >
              <TrendingUp className="w-4 h-4 mr-1" /> View Item Breakdown
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          
          {/* Filters Toolbar */}
          <div className="p-4 border-b border-base-200 grid grid-cols-1 md:grid-cols-4 gap-4 bg-base-200/30 rounded-t-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Search name, email, ID..."
                className="input input-sm input-bordered w-full pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select className="select select-sm select-bordered w-full" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONTACTED">Contacted</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select className="select select-sm select-bordered w-full" value={itemFilter} onChange={(e) => setItemFilter(e.target.value)}>
              <option value="ALL">All Items</option>
              {uniqueItems.map((item) => (
                <option key={item.id} value={item.id.toString()}>{item.name}</option>
              ))}
            </select>

            <select className="select select-sm select-bordered w-full" value={artistFilter} onChange={(e) => setArtistFilter(e.target.value)}>
              <option value="ALL">All Artists</option>
              {uniqueArtists.map((artist) => (
                <option key={artist.id} value={artist.id.toString()}>{artist.name}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200/50">
                  <th>Order Info</th>
                  <th>Customer</th>
                  <th>Items Ordered</th>
                  <th>Item Total</th>
                  <th>Order Total</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              {filteredOrders.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-base-content/50">
                      No orders found matching your filters.
                    </td>
                  </tr>
                </tbody>
              ) : (
                /* We use multiple <tbody> tags so we can cleanly border group each order */
                filteredOrders.map((order) => (
                  <tbody key={order.id} className="border-b-2 border-base-200 hover:bg-base-200/20 transition-colors">
                    {order.orderItems.map((oi, index) => (
                      <tr key={oi.id} className="border-none">
                        
                        {/* Order-level columns (Only render on the first row and span down) */}
                        {index === 0 && (
                          <>
                            <td rowSpan={order.orderItems.length} className="align-top w-48">
                              <div className="font-mono text-xs opacity-70" title={order.id}>{order.id.split("-")[0]}</div>
                              <div className="text-sm font-medium mt-1">{formatDate(order.createdAt)}</div>
                            </td>
                            <td rowSpan={order.orderItems.length} className="align-top w-56">
                              <div className="font-bold">{order.customerName}</div>
                              <div className="text-xs opacity-70">{order.customerEmail}</div>
                            </td>
                          </>
                        )}

                        {/* Item-level columns (Render for every row) */}
                        <td className="py-2">
                          <div className="font-semibold text-sm">
                            {oi.item.name} 
                            <span className="badge badge-sm badge-primary ml-2">x{oi.quantity}</span>
                          </div>
                          <div className="text-xs opacity-60 mt-0.5">
                            By {oi.item.itemArtists.map((ia) => ia.artist.name).join(", ")}
                          </div>
                        </td>
                        <td className="py-2 font-mono text-sm opacity-80">
                          {formatIDR(oi.priceAtTime * oi.quantity)}
                        </td>

                        {/* Order-level columns (Only render on the first row and span down) */}
                        {index === 0 && (
                          <>
                            <td rowSpan={order.orderItems.length} className="align-top font-mono font-bold w-32 text-primary">
                              {formatIDR(getOrderTotal(order.orderItems))}
                            </td>
                            <td rowSpan={order.orderItems.length} className="align-top w-40">
                              <select
                                className={`select select-sm select-bordered w-full font-semibold ${statusColors[order.status] || "badge-ghost"}`}
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CONTACTED">CONTACTED</option>
                                <option value="COMPLETED">COMPLETED</option>
                              </select>
                            </td>
                            <td rowSpan={order.orderItems.length} className="align-top text-right">
                              <button
                                className="btn btn-sm btn-ghost btn-square"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  (document.getElementById("order_detail_modal") as HTMLDialogElement)?.showModal();
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                ))
              )}
            </table>
          </div>
        </div>
      </div>

      {/* --- Stats / Aggregation Modal --- */}
      <dialog id="stats_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100">
          <h3 className="font-bold text-2xl mb-4">Item Sales Breakdown</h3>
          <p className="text-sm opacity-70 mb-4">Quantities based on current filters.</p>
          
          <div className="overflow-y-auto max-h-[50vh]">
            <table className="table table-sm table-pin-rows">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th className="text-center">Qty Sold</th>
                  <th className="text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {itemSalesStats.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-4">No items sold matching filters.</td></tr>
                )}
                {itemSalesStats.map((stat) => (
                  <tr key={stat.name}>
                    <td className="font-semibold">{stat.name}</td>
                    <td className="text-center font-mono font-bold text-primary">{stat.qty}</td>
                    <td className="text-right font-mono">{formatIDR(stat.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn">Close</button></form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* --- Details Modal (Keeping your previous implementation) --- */}
      <dialog id="order_detail_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100 max-w-2xl">
          {selectedOrder && (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-2xl">Order Details</h3>
                  <p className="font-mono text-xs opacity-70 mt-1">{selectedOrder.id}</p>
                </div>
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                </form>
              </div>

              <div className="bg-base-200/50 p-4 rounded-xl mb-6">
                <h4 className="font-bold mb-2 text-sm uppercase opacity-70">Customer Details</h4>
                <p className="font-medium">{selectedOrder.customerName}</p>
                <p className="text-sm opacity-80">{selectedOrder.customerEmail}</p>
                {selectedOrder.customerPhone && <p className="text-sm opacity-80 mt-1">📞 {selectedOrder.customerPhone}</p>}
                
                {selectedOrder.notes && (
                  <div className="mt-4 pt-4 border-t border-base-300">
                    <h4 className="font-bold mb-1 text-sm uppercase opacity-70">Notes</h4>
                    <p className="text-sm italic opacity-80">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

    </div>
  );
}