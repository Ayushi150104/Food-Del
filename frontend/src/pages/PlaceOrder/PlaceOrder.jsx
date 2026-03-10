import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import Order from "../../components/Order";
import { IoIosArrowDown } from "react-icons/io";

const PlaceOrder = () => {
  const { getTotalCartAmount } = useContext(StoreContext);
  const [open, setOpen] = useState(false);
  const [showFormMobile, setShowFormMobile] = useState(false);

  // Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !street || !phone) {
      alert("Please fill in the delivery details");
      setShowFormMobile(true);
      return;
    }
    setOpen(true);
  };

  return (
    <form
      className="flex flex-col-reverse md:flex-row gap-8 p-4 md:p-10 max-w-6xl mx-auto"
      onSubmit={handleSubmit}
    >
      {/* 1. PRICING SECTION: order-1 on mobile, order-2 on desktop */}
      <div className="w-full md:max-w-md order-1 md:order-2">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-black mb-6">Cart Totals</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr className="border-slate-100" />
            <div className="flex justify-between text-slate-600">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr className="border-slate-100" />
            <div className="flex justify-between text-lg font-bold text-slate-900">
              <p>Total</p>
              <p>
                ₹
                {getTotalCartAmount() === 0
                  ? 0
                  : (getTotalCartAmount() + 2).toFixed(2)}
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-8 bg-orange-500 text-white py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md shadow-black/20"
          >
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>

      {/* 2. FORM SECTION: order-2 on mobile, order-1 on desktop */}
      <div className="flex-1 w-full order-2 md:order-1">
        {/* Mobile Accordion Header */}
        <div
          className="flex items-center justify-between bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none cursor-pointer md:cursor-default transition-colors hover:bg-slate-100 md:hover:bg-transparent"
          onClick={() => setShowFormMobile(!showFormMobile)}
        >
          <p className="text-lg font-extrabold text-slate-800 md:mb-8 md:text-2xl">
            Delivery Information
          </p>
          <div
            className={`md:hidden transition-transform duration-300 ${showFormMobile ? "rotate-180" : ""}`}
          >
            <span className="text-2xl">
              <IoIosArrowDown />
            </span>
          </div>
        </div>

        {/* Collapsible Content */}
        <div
          className={`${showFormMobile ? "flex" : "hidden"} md:flex flex-col gap-4 mt-6 md:mt-0`}
        >
          <div className="flex gap-3">
            <input
              required
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 p-3 border border-slate-200 rounded-lg outline-orange-500"
            />
            <input
              required
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 p-3 border border-slate-200 rounded-lg outline-orange-500"
            />
          </div>
          <input
            required
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-slate-200 rounded-lg outline-orange-500"
          />
          <input
            required
            type="text"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="p-3 border border-slate-200 rounded-lg outline-orange-500"
          />
          <div className="flex gap-3">
            <input
              required
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-1/2 p-3 border border-slate-200 rounded-lg outline-orange-500"
            />
            <input
              required
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-1/2 p-3 border border-slate-200 rounded-lg outline-orange-500"
            />
          </div>
          <div className="flex gap-3">
            <input
              required
              type="text"
              placeholder="Zip code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-1/2 p-3 border border-slate-200 rounded-lg outline-orange-500"
            />
            <input
              required
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-1/2 p-3 border border-slate-200 rounded-lg outline-orange-500"
            />
          </div>
          <input
            required
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 border border-slate-200 rounded-lg outline-orange-500"
          />
        </div>
      </div>

      {/* Modal */}
      {open && (
        <Order
          setOpen={setOpen}
          fullName={`${firstName} ${lastName}`}
          email={email}
          phone={phone}
          address={`${street}, ${city}, ${state}, ${zip}, ${country}`}
        />
      )}
    </form>
  );
};

export default PlaceOrder;
