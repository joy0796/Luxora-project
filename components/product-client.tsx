"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useCart } from "@/components/cart-provider";
import { ProductCard } from "@/components/product-card";
// import { products, type Product } from "@/lib/products";
import { products, type Product } from "@/lib/data";

export function ProductClient({ product: p }: { product: Product }) {
  const [image, setImage] = useState(0);
  const [color, setColor] = useState(p.colors[0].name);
  const [qty, setQty] = useState(1);

  const { addToCart } = useCart();

  const recommendedProducts = products
    .filter((x) => x.id !== p.id)
    .slice(0, 4);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]"
      >
        {/* Product Images */}
        <div className="grid gap-3 sm:grid-cols-[72px_1fr]">
          <div className="order-2 flex gap-2 sm:order-1 sm:flex-col">
            {p.images.map((x, i) => (
              <button
                key={x}
                onClick={() => setImage(i)}
                className={`relative aspect-square w-[64px] overflow-hidden border ${
                  image === i ? "border-ink" : "border-transparent"
                }`}
              >
                <Image
                  src={x}
                  alt={p.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <div className="relative aspect-[.9] overflow-hidden bg-[#eee9e2] sm:order-2">
            <Image
              src={p.images[image]}
              alt={p.name}
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center lg:px-8">
          <span className="eyebrow">{p.category}</span>

          <h1 className="display-serif mt-4 text-4xl md:text-5xl">
            {p.name}
          </h1>

          <p className="mt-4 text-lg">
            ${p.price.toFixed(2)}
          </p>

          <p className="mt-5 max-w-lg text-sm leading-7 text-muted">
            {p.description}
          </p>

          {/* Colors */}
          <div className="mt-7">
            <div className="mb-3 flex justify-between text-[10px] uppercase tracking-[.1em]">
              <span>Color</span>
              <span>{color}</span>
            </div>

            <div className="flex gap-2">
              {p.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    color === c.name
                      ? "border-ink"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          {/* Quantity + Cart */}
          <div className="mt-7 flex gap-3">
            <div className="flex items-center border border-line">
              <button
                className="p-3"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                <Minus size={13} />
              </button>

              <span className="w-8 text-center text-xs">
                {qty}
              </span>

              <button
                className="p-3"
                onClick={() => setQty(qty + 1)}
              >
                <Plus size={13} />
              </button>
            </div>

            <button
              onClick={() => addToCart(p, color, qty)}
              className="lux-button flex-1"
            >
              Add to Cart
            </button>

            <button
              className="grid w-12 place-items-center border border-line"
              aria-label="Add to wishlist"
            >
              <Heart size={17} />
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-3 border-y border-line py-5">
            {[
              [Truck, "Free Shipping"],
              [RotateCcw, "Easy Returns"],
              [ShieldCheck, "Secure Payment"],
            ].map(([Icon, text]) => {
              const IconComponent = Icon as React.ElementType;

              return (
                <div
                  key={text as string}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <IconComponent size={17} />

                  <span className="text-[9px] uppercase tracking-[.08em]">
                    {text as string}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Product Info */}
          <div className="mt-7 space-y-4 border-b border-line pb-5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">Material</span>
              <span>{p.material}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted">Dimensions</span>
              <span>{p.dimensions}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recommended Products */}
      <section className="mt-20 border-t border-line pt-14">
        <span className="eyebrow">You may also like</span>

        <h2 className="display-serif mt-2 text-4xl">
          Complete the edit
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {recommendedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>
    </>
  );
}