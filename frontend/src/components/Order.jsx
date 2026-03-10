import { motion } from "framer-motion";
import foodImg from "../assets/food_8.png";
import { useMemo, useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";

const Order = ({ setOpen, fullName, email, phone, address }) => {
  const { cartItems, food_list, getTotalCartAmount, url, removeFromCart } =
    useContext(StoreContext);

  const selectedItems = food_list.filter((item) => cartItems[item._id] > 0);

  const formatter = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  });
  const formattedNames =
    selectedItems.length > 0
      ? formatter.format(selectedItems.map((i) => i.name))
      : "No items";
  const formattedDes =
    selectedItems.length > 0
      ? formatter.format(selectedItems.map((i) => i.description))
      : "No description available";

  const randomColor = useMemo(() => {
    const COLORS = [
      "bg-emerald-500",
      "bg-sky-500",
      "bg-violet-500",
      "bg-rose-500",
      "bg-amber-500",
    ];
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }, []);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    toast.success("Order placed successfully!");
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setOpen(false)}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* 2. Updated Modal (Inner Div) */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: "spring", damping: 25, stiffness: 300 },
        }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white shadow-2xl w-full max-w-2xl overflow-hidden max-h-max flex flex-col"
      >
        {/* Header Section */}
        <div className="px-8 py-6 pb-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-3 z-20">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Order Details
            </h2>
          </div>
          <div
            className={`${randomColor} px-4 py-1.5 rounded-full text-white text-[10px] font-black shadow-lg shadow-inner uppercase tracking-wider`}
          >
            ID #123-AC
          </div>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left: Product Info */}
            <div className="space-y-6 flex flex-col">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.15em] block mb-2">
                    Items
                  </label>
                  <p className="text-lg text-slate-800 font-bold leading-[1.2]">
                    {formattedNames}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.15em] block mb-2">
                    Description
                  </label>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    {formattedDes}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Modern Equal Image Grid */}
            <div
              className={`grid gap-2.5 rounded-2xl overflow-hidden h-64 w-full bg-slate-50 p-2.5 border border-slate-100 
              ${selectedItems.length === 1 ? "grid-cols-1" : selectedItems.length === 2 ? "grid-cols-2" : "grid-cols-2"}`}
            >
              {selectedItems
                .slice(0, selectedItems.length > 3 ? 3 : 4)
                .map((item, index) => (
                  <div
                    key={index}
                    className={`relative rounded-xl overflow-hidden border-2 border-white shadow-sm transition-transform hover:scale-[1.02]
                  ${selectedItems.length === 3 && index === 0 ? "col-span-2" : ""}
                  ${selectedItems.length === 1 ? "h-full" : "h-full"}`}
                  >
                    <img
                      src={url + "/images/" + item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

              {selectedItems.length > 3 && (
                <div className="rounded-xl bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                  <span className="text-xl font-black text-slate-800">
                    +{selectedItems.length - 3}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-tighter">
                    More
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Customer & Address: Professional Layout */}
          <div className="mt-7 flex flex-col sm:flex-row justify-between items-start gap-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
            <div className="flex-1 border-l-2 border-slate-200 pl-4">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-2">
                Customer Profile
              </label>
              <p className="text-sm text-slate-800 font-extrabold">
                {fullName || "N/A"}
              </p>
              <p className="text-slate-500 text-xs font-medium mt-1 italic">
                {phone || "No contact provided"}
              </p>
            </div>
            <div className="flex-1 border-l-2 border-slate-200 pl-4">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-2">
                Shipping To
              </label>
              <p className="text-slate-600 text-xs leading-relaxed font-medium max-w-[220px]">
                {address || "No address provided"}
              </p>
            </div>
          </div>

          {/* Total Bill Section */}
          <div className="mt-10 pt-8 border-t border-slate-100">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Final Invoice
                </span>
                <div className="flex gap-4 mt-2">
                  <p className="text-xs text-slate-400 font-bold">
                    Items: ₹{getTotalCartAmount().toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-400 font-bold">
                    Tax: ₹{(getTotalCartAmount() * 0.05).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                  ₹{(getTotalCartAmount() + 2).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-3 group"
              onClick={(e) => handlePlaceOrder(e)}
            >
              <span>Place Order</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Order;
