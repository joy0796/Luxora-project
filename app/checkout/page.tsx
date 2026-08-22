// "use client";

// import { useState } from "react";
// import { useCart } from "@/components/cart-provider";
// import { useAuth } from "@/components/auth-provider";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function Checkout() {
//   const { items, subtotal } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();

//   const [name, setName] = useState(user?.displayName || "");
//   const [email, setEmail] = useState(user?.email || "");
//   const [address, setAddress] = useState("");
//   const [city, setCity] = useState("");
//   const [phone, setPhone] = useState("");

//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState("");

//   /*
//    * These are currently only used for displaying
//    * the existing LUXORA UI.
//    *
//    * IMPORTANT:
//    * The server will calculate the real order total.
//    * We do NOT send these values to Paystack.
//    */
//   const shipping = subtotal >= 100 ? 0 : 12;
//   const total = subtotal + shipping;

//   async function pay(e: React.FormEvent) {
//     e.preventDefault();

//     setError("");

//     if (!user) {
//       router.push("/login?next=/checkout");
//       return;
//     }

//     if (items.length === 0) {
//       setError("Your cart is empty.");
//       return;
//     }

//     setBusy(true);

//     try {
//       /*
//        * STEP 1
//        * Create the order on our server.
//        *
//        * We only send:
//        * - product ID
//        * - quantity
//        * - selected color
//        *
//        * We DO NOT send price or total.
//        */
//       const orderResponse = await fetch("/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: user.uid,
//           email,
//           name,
//           phone,
//           address,
//           city,

//           items: items.map((item) => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             color: item.color,
//           })),
//         }),
//       });

//       const orderData = await orderResponse.json();

//       if (!orderResponse.ok) {
//         throw new Error(
//           orderData.error || "Unable to create your order."
//         );
//       }

//       /*
//        * STEP 2
//        * The server has now calculated the real:
//        *
//        * subtotal
//        * shipping
//        * total
//        *
//        * and created a pending Firebase order.
//        *
//        * We now initialize Paystack using that
//        * server-calculated total.
//        */
//       const paymentResponse = await fetch(
//         "/api/paystack/initialize",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email,

//             // IMPORTANT:
//             // This amount came from our server.
//             amount: orderData.total,

//             // Firebase order ID becomes Paystack reference.
//             reference: orderData.orderId,

//             metadata: {
//               orderId: orderData.orderId,
//               userId: user.uid,
//               name,
//               phone,
//               address,
//               city,
//             },
//           }),
//         }
//       );

//       const paymentData = await paymentResponse.json();

//       if (!paymentResponse.ok) {
//         throw new Error(
//           paymentData.error ||
//             "Unable to start payment."
//         );
//       }

//       if (!paymentData.authorization_url) {
//         throw new Error(
//           "Paystack did not return a payment URL."
//         );
//       }

//       /*
//        * STEP 3
//        * Send customer to Paystack.
//        */
//       window.location.href =
//         paymentData.authorization_url;
//     } catch (err) {
//       console.error("Checkout error:", err);

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Payment could not be started."
//       );

//       setBusy(false);
//     }
//   }

//   if (items.length === 0) {
//     return (
//       <main className="container min-h-[65vh] py-20 text-center">
//         <span className="eyebrow">Checkout</span>

//         <h1 className="display-serif mt-4 text-5xl">
//           Your bag is empty.
//         </h1>

//         <Link
//           href="/collections"
//           className="lux-button mt-8"
//         >
//           Shop Collections
//         </Link>
//       </main>
//     );
//   }

//   return (
//     <main className="container py-12 md:py-16">
//       <div className="mb-10">
//         <span className="eyebrow">
//           Secure checkout
//         </span>

//         <h1 className="display-serif mt-3 text-5xl">
//           Complete your order.
//         </h1>
//       </div>

//       <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
//         <form
//           onSubmit={pay}
//           className="space-y-5"
//         >
//           <div className="border border-line p-6">
//             <h2 className="display-serif text-2xl">
//               Contact & delivery
//             </h2>

//             <div className="mt-5 grid gap-4 sm:grid-cols-2">
//               <label className="block sm:col-span-2">
//                 <span className="field-label">
//                   Full name
//                 </span>

//                 <input
//                   required
//                   value={name}
//                   onChange={(e) =>
//                     setName(e.target.value)
//                   }
//                   className="field"
//                 />
//               </label>

//               <label className="block">
//                 <span className="field-label">
//                   Email
//                 </span>

//                 <input
//                   required
//                   type="email"
//                   value={email}
//                   onChange={(e) =>
//                     setEmail(e.target.value)
//                   }
//                   className="field"
//                 />
//               </label>

//               <label className="block">
//                 <span className="field-label">
//                   Phone
//                 </span>

//                 <input
//                   required
//                   value={phone}
//                   onChange={(e) =>
//                     setPhone(e.target.value)
//                   }
//                   className="field"
//                 />
//               </label>

//               <label className="block sm:col-span-2">
//                 <span className="field-label">
//                   Address
//                 </span>

//                 <input
//                   required
//                   value={address}
//                   onChange={(e) =>
//                     setAddress(e.target.value)
//                   }
//                   className="field"
//                 />
//               </label>

//               <label className="block">
//                 <span className="field-label">
//                   City
//                 </span>

//                 <input
//                   required
//                   value={city}
//                   onChange={(e) =>
//                     setCity(e.target.value)
//                   }
//                   className="field"
//                 />
//               </label>
//             </div>
//           </div>

//           {error && (
//             <p className="border border-red-200 bg-red-50 p-3 text-xs text-red-700">
//               {error}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={busy || !user}
//             className="lux-button w-full disabled:opacity-50"
//           >
//             {busy
//               ? "Redirecting to payment…"
//               : "Pay securely with Paystack"}
//           </button>

//           {!user && (
//             <p className="text-center text-xs text-muted">
//               Please{" "}
//               <Link
//                 href="/login?next=/checkout"
//                 className="underline"
//               >
//                 sign in
//               </Link>{" "}
//               before checkout.
//             </p>
//           )}
//         </form>

//         <aside className="h-fit border border-line bg-cream p-6">
//           <h2 className="display-serif text-2xl">
//             Order summary
//           </h2>

//           <div className="mt-5 space-y-4">
//             {items.map((i) => (
//               <div
//                 key={`${i.productId}-${i.color}`}
//                 className="flex justify-between gap-4 text-xs"
//               >
//                 <span>
//                   {i.name} × {i.quantity}

//                   <small className="block text-muted">
//                     {i.color}
//                   </small>
//                 </span>

//                 <span>
//   ₦{(i.price * i.quantity).toLocaleString("en-NG")}
// </span>
//               </div>
//             ))}
//           </div>

//           <div className="mt-6 space-y-3 border-t border-line pt-5 text-xs">
//             <div className="flex justify-between">
//               <span>Subtotal</span>

//               <span>
//   ₦{subtotal.toLocaleString("en-NG")}
// </span>
//             </div>

//             <div className="flex justify-between">
//               <span>Shipping</span>

//               {shipping === 0
//   ? "Free"
//   : `₦${shipping.toLocaleString("en-NG")}`}
//             </div>

//             <div className="flex justify-between border-t border-line pt-4 text-sm font-semibold">
//               <span>Total</span>

//               <span>
//   ₦{total.toLocaleString("en-NG")}
// </span>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </main>
//   );
// }



"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Checkout() {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  /*
   * LUXORA SHIPPING
   *
   * Keep the existing checkout calculation for now.
   * We are returning to the TEST payment flow.
   */
  const shipping = subtotal >= 100 ? 0 : 12;
  const total = subtotal + shipping;

  async function pay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    /*
     * Customer must be logged in before payment.
     */
    if (!user) {
      router.push("/login?next=/checkout");
      return;
    }

    /*
     * Prevent checkout with an empty cart.
     */
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setBusy(true);

    try {
      /*
       * Send the checkout information directly
       * to the Paystack initialization API.
       *
       * IMPORTANT:
       * We are NOT calling /api/orders here.
       *
       * This restores the payment flow that was
       * working before the production changes.
       */
      const response = await fetch(
        "/api/paystack/initialize",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            name,
            phone,
            address,
            city,
            items,
            total,
            userId: user.uid,
          }),
        }
      );

      /*
       * Read the response as text first.
       *
       * This prevents:
       *
       * Unexpected token '<'
       *
       * when the server accidentally returns an HTML
       * error page instead of JSON.
       */
      const responseText = await response.text();

      let data: {
        authorization_url?: string;
        access_code?: string;
        reference?: string;
        error?: string;
      };

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error(
          "Paystack API returned non-JSON response:",
          responseText
        );

        throw new Error(
          "The payment server returned an invalid response. Please try again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to start payment."
        );
      }

      /*
       * Paystack must return an authorization URL.
       */
      if (!data.authorization_url) {
        console.error(
          "Paystack response:",
          data
        );

        throw new Error(
          "Paystack did not return a payment URL."
        );
      }

      /*
       * Redirect customer to Paystack.
       */
      window.location.href =
        data.authorization_url;
    } catch (err) {
      console.error(
        "Checkout error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Payment could not be started."
      );

      setBusy(false);
    }
  }

  /*
   * Empty cart
   */
  if (items.length === 0) {
    return (
      <main className="container min-h-[65vh] py-20 text-center">
        <span className="eyebrow">
          Checkout
        </span>

        <h1 className="display-serif mt-4 text-5xl">
          Your bag is empty.
        </h1>

        <Link
          href="/collections"
          className="lux-button mt-8"
        >
          Shop Collections
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-12 md:py-16">
      <div className="mb-10">
        <span className="eyebrow">
          Secure checkout
        </span>

        <h1 className="display-serif mt-3 text-5xl">
          Complete your order.
        </h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* =========================
            CUSTOMER INFORMATION
        ========================== */}

        <form
          onSubmit={pay}
          className="space-y-5"
        >
          <div className="border border-line p-6">
            <h2 className="display-serif text-2xl">
              Contact & delivery
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* Full name */}

              <label className="block sm:col-span-2">
                <span className="field-label">
                  Full name
                </span>

                <input
                  required
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="field"
                  placeholder="Enter your full name"
                />
              </label>

              {/* Email */}

              <label className="block">
                <span className="field-label">
                  Email
                </span>

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="field"
                  placeholder="you@example.com"
                />
              </label>

              {/* Phone */}

              <label className="block">
                <span className="field-label">
                  Phone
                </span>

                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className="field"
                  placeholder="Phone number"
                />
              </label>

              {/* Address */}

              <label className="block sm:col-span-2">
                <span className="field-label">
                  Address
                </span>

                <input
                  required
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  className="field"
                  placeholder="Delivery address"
                />
              </label>

              {/* City */}

              <label className="block">
                <span className="field-label">
                  City
                </span>

                <input
                  required
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  className="field"
                  placeholder="City"
                />
              </label>
            </div>
          </div>

          {/* Error */}

          {error && (
            <p className="border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </p>
          )}

          {/* Payment button */}

          <button
            type="submit"
            disabled={busy || !user}
            className="lux-button w-full disabled:opacity-50"
          >
            {busy
              ? "Redirecting to payment…"
              : "Pay securely with Paystack"}
          </button>

          {/* Login message */}

          {!user && (
            <p className="text-center text-xs text-muted">
              Please{" "}
              <Link
                href="/login?next=/checkout"
                className="underline"
              >
                sign in
              </Link>{" "}
              before checkout.
            </p>
          )}
        </form>

        {/* =========================
            ORDER SUMMARY
        ========================== */}

        <aside className="h-fit border border-line bg-cream p-6">
          <h2 className="display-serif text-2xl">
            Order summary
          </h2>

          {/* Products */}

          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.color}`}
                className="flex justify-between gap-4 text-xs"
              >
                <span>
                  {item.name} × {item.quantity}

                  <small className="block text-muted">
                    {item.color}
                  </small>
                </span>

                <span>
                  $
                  {(
                    item.price *
                    item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}

          <div className="mt-6 space-y-3 border-t border-line pt-5 text-xs">
            {/* Subtotal */}

            <div className="flex justify-between">
              <span>
                Subtotal
              </span>

              <span>
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {/* Shipping */}

            <div className="flex justify-between">
              <span>
                Shipping
              </span>

              <span>
                {shipping === 0
                  ? "Free"
                  : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            {/* Total */}

            <div className="flex justify-between border-t border-line pt-4 text-sm font-semibold">
              <span>
                Total
              </span>

              <span>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}