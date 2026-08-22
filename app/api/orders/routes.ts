// import { NextResponse } from "next/server";
// import { products } from "@/lib/data";
// import { adminDb } from "@/lib/firebase-admin";
// import { FieldValue } from "firebase-admin/firestore";

// type IncomingItem = {
//   productId: string;
//   quantity: number;
//   color?: string;
// };

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const {
//       userId,
//       email,
//       name,
//       phone,
//       address,
//       city,
//       items,
//     } = body as {
//       userId?: string;
//       email?: string;
//       name?: string;
//       phone?: string;
//       address?: string;
//       city?: string;
//       items?: IncomingItem[];
//     };

//     if (!userId) {
//       return NextResponse.json(
//         { error: "You must be logged in." },
//         { status: 401 }
//       );
//     }

//     if (!email || !name || !phone || !address || !city) {
//       return NextResponse.json(
//         { error: "Please complete your delivery information." },
//         { status: 400 }
//       );
//     }

//     if (!Array.isArray(items) || items.length === 0) {
//       return NextResponse.json(
//         { error: "Your cart is empty." },
//         { status: 400 }
//       );
//     }

//     /*
//      * IMPORTANT:
//      * We calculate prices from our trusted product catalogue.
//      * We NEVER trust price/total values sent by the browser.
//      */

//     const orderItems = [];

//     for (const item of items) {
//       const product = products.find(
//         (product) => product.id === item.productId
//       );

//       if (!product) {
//         return NextResponse.json(
//           {
//             error: `Product ${item.productId} was not found.`,
//           },
//           { status: 400 }
//         );
//       }

//       const quantity = Number(item.quantity);

//       if (!Number.isInteger(quantity) || quantity < 1) {
//         return NextResponse.json(
//           {
//             error: `Invalid quantity for ${product.name}.`,
//           },
//           { status: 400 }
//         );
//       }

//       const selectedColor =
//         item.color || product.colors[0]?.name || "Default";

//       const validColor = product.colors.some(
//         (color) => color.name === selectedColor
//       );

//       if (!validColor) {
//         return NextResponse.json(
//           {
//             error: `Invalid color selected for ${product.name}.`,
//           },
//           { status: 400 }
//         );
//       }

//       orderItems.push({
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         image: product.image,
//         quantity,
//         color: selectedColor,
//       });
//     }

//     const subtotal = orderItems.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );

//     const shipping = subtotal >= 100 ? 0 : 12;

//     const total = subtotal + shipping;

//     const orderRef = adminDb.collection("orders").doc();

//     await orderRef.set({
//       userId,
//       email,
//       name,
//       phone,
//       address,
//       city,

//       items: orderItems,

//       subtotal,
//       shipping,
//       total,

//       currency: "NGN",

//       paymentStatus: "pending",
//       orderStatus: "pending",
//       paymentProvider: "paystack",

//       createdAt: FieldValue.serverTimestamp(),
//       updatedAt: FieldValue.serverTimestamp(),
//     });

//     return NextResponse.json({
//       success: true,
//       orderId: orderRef.id,
//       subtotal,
//       shipping,
//       total,
//       currency: "NGN",
//     });
//   } catch (error) {
//     console.error("Order creation error:", error);

//     return NextResponse.json(
//       { error: "Unable to create order." },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { products } from "@/lib/data";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

type IncomingItem = {
  productId: string;
  quantity: number;
  color?: string;
};

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      userId,
      email,
      name,
      phone,
      address,
      city,
      items,
    } = body as {
      userId?: string;
      email?: string;
      name?: string;
      phone?: string;
      address?: string;
      city?: string;
      items?: IncomingItem[];
    };

    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    if (!email || !name || !phone || !address || !city) {
      return NextResponse.json(
        { error: "Please complete your delivery information." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = products.find(
        (product) => product.id === item.productId
      );

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} was not found.` },
          { status: 400 }
        );
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json(
          { error: `Invalid quantity for ${product.name}.` },
          { status: 400 }
        );
      }

      const selectedColor =
        item.color || product.colors[0]?.name || "Default";

      const validColor = product.colors.some(
        (color) => color.name === selectedColor
      );

      if (!validColor) {
        return NextResponse.json(
          {
            error: `Invalid color selected for ${product.name}.`,
          },
          { status: 400 }
        );
      }

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        color: selectedColor,
      });
    }

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shipping = subtotal >= 100 ? 0 : 12;
    const total = subtotal + shipping;

    const orderRef = adminDb.collection("orders").doc();

    await orderRef.set({
      userId,
      email,
      name,
      phone,
      address,
      city,
      items: orderItems,
      subtotal,
      shipping,
      total,
      currency: "NGN",
      paymentStatus: "pending",
      orderStatus: "pending",
      paymentProvider: "paystack",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      orderId: orderRef.id,
      subtotal,
      shipping,
      total,
      currency: "NGN",
    });
  } catch (error) {
    console.error("ORDER CREATION ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create order.",
      },
      { status: 500 }
    );
  }
}