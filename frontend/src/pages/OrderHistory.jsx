import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreContext";

const OrderHistory = () => {
  const { getOrders, currency } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    if (data) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          My Orders
        </h1>
        <button
          onClick={fetchOrders}
          className="text-xs font-bold text-orange-500 uppercase tracking-widest hover:text-orange-600 transition-colors"
        >
          Refresh List
        </button>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">
              No orders found yet. Ready for some food?
            </p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div
              key={index}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-6 gap-6 items-center"
            >
              {/* Product Info */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-1">
                  Order Details
                </label>
                <p className="text-sm font-bold text-slate-800 line-clamp-1 flex-wrap flex w-64">
                  {order.products.map((p) => p.name).join(", ") || "Food Items"}
                </p>
                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded mt-2 inline-block">
                  #{order.nativeId}
                </span>
              </div>

              {/* Amount */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-1">
                  Total
                </label>
                <p className="text-lg font-black text-slate-900">
                  {currency || "₹"}
                  {order.totalAmount.toFixed(2)}
                </p>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-1">
                  Items
                </label>
                <p className="text-sm font-bold text-slate-600">
                  x{order.products.length}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                <p className="text-sm font-bold text-slate-800">
                  {order.status}
                </p>
              </div>

              {/* Action */}
              <div className="text-right">
                <button className="bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-black transition-all active:scale-95 w-full md:w-auto">
                  Track Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
