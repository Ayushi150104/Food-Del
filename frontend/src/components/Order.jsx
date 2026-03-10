import { motion } from "framer-motion";
import foodImg from "../assets/food_8.png";
import { useMemo, useContext, useState } from "react";
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

  const { addOrders } = useContext(StoreContext);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const orderData = {
      products: selectedItems.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item._id],
      })),
      description: formattedDes,
      totalAmount: Number((getTotalCartAmount() + 2).toFixed(2)), // Matches 'Number' type
      PaymentAddress: address,
    };

    try {
      // 2. Call the addOrders function from StoreContext
      const result = await addOrders(orderData);

      if (result.success) {
        toast.success(`Order #${result.nativeId} placed successfully!`);

        // 3. UI cleanup and redirection
        setTimeout(() => {
          setOpen(false);
          // Clear local cart state if not already handled in context
          // setCartItems({});
        }, 2000);
      } else {
        toast.error(result.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Placement Error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const [pop, setPop] = useState(false);

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
        className="bg-white shadow-2xl w-full max-w-2xl max-h-[100vh] flex flex-col overflow-hidden"
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
            <div className="flex justify-center items-center">
              <div
                className={`grid gap-2.5 rounded-2xl overflow-hidden min-h-64 w-full bg-slate-50 p-2.5 border border-slate-100 
  ${selectedItems.length > 3 ? "grid-cols-2" : "grid-cols-1"}`}
              >
                {selectedItems.length > 0 && (
                  <>
                    {/* Show first 4 items if overflowing, otherwise show all items up to 5 */}
                    {selectedItems
                      .slice(0, selectedItems.length > 5 ? 4 : 5)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="relative rounded-xl overflow-hidden border-2 border-white shadow-sm transition-transform hover:scale-[1.02] h-32"
                        >
                          <img
                            src={`${url}/images/${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}

                    {/* The dynamic "More" card: only shows if total items > 5 */}
                    {selectedItems.length > 5 && (
                      <div
                        className="rounded-xl bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors h-32"
                        onClick={() => setPop(true)}
                      >
                        <span className="text-xl font-black text-slate-800">
                          +{selectedItems.length - 4}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-tighter">
                          More
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {pop && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              {/* Backdrop for the sub-modal */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPop(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />

              {/* Sub-modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 flex flex-col max-h-[80vh]"
              >
                {/* Mini Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    All Items ({selectedItems.length})
                  </h3>
                  <button
                    onClick={() => setPop(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Grid of Items */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedItems.map((item, idx) => (
                      <div key={idx} className="group relative">
                        <div className="aspect-square rounded-2xl overflow-hidden border-2 border-slate-50 shadow-sm">
                          <img
                            src={url + "/images/" + item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur px-2 py-0.5 rounded-lg border border-slate-100 shadow-sm">
                          <p className="text-[10px] font-black text-slate-800">
                            x{cartItems[item._id]}
                          </p>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 mt-2 truncate px-1 uppercase tracking-tighter">
                          {item.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer hint */}
                <div className="p-4 bg-slate-50 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Click outside to return
                  </p>
                </div>
              </motion.div>
            </div>
          )}

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
          <div className="mt-4 pt-8 border-t border-slate-100">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Final Invoice
                </span>
                <div className="flex gap-4 mt-2">
                  <p className="text-xs text-slate-400 font-bold">
                    Items: &#8377;{getTotalCartAmount().toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-400 font-bold">
                    Tax: &#8377;{(getTotalCartAmount() * 0.05).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right flex flex-col gap-2 ">
                <span className="bg-green-200 text-green-900 p-2 rounded-2xl text-xs h-max w-max flex items-cetner justify-center">
                  Cash On Delivery (COD)
                </span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter mr-1">
                  &#8377;{(getTotalCartAmount() + 2).toFixed(2)}
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
