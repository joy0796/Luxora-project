//  "use client";
// import Link from "next/link";import {Menu,ShoppingBag,User,X} from "lucide-react";
// import { useAuth } from "./auth-provider";import {useState} from "react";import {useCart} from "./cart-provider";
// export function SiteHeader(){const[open,setOpen]=useState(false);const{count}=useCart();const{user}=useAuth();const links=[["NEW IN","/#new"],["SHOP","/collections"],["COLLECTIONS","/collections"],["BEST SELLERS","/#bestsellers"],["ABOUT US","/about"]];return <><div className="flex h-[34px] items-center justify-center bg-[#171717] px-4 text-[10px] text-white">FREE SHIPPING ON ALL ORDERS OVER $100</div><header className="sticky top-0 z-40 border-b border-black/10 bg-paper/95 backdrop-blur-md"><nav className="container flex h-[76px] items-center justify-between gap-6"><button className="md:hidden" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu size={20} strokeWidth={1.5}/></button><Link href="/" className="display-serif text-[25px] tracking-[.12em]">LUXORA</Link><div className="hidden items-center gap-7 md:flex">{links.map(([l,h])=><Link key={l} href={h} className="text-[10px] font-semibold tracking-[.05em] hover:opacity-60">{l}</Link>)}</div><div className="flex items-center gap-4"><Link href={user?"/account":"/login"} aria-label="Account"><User className="hidden sm:block" size={18} strokeWidth={1.5}/></Link><Link href="/cart" className="relative"><ShoppingBag size={19} strokeWidth={1.5}/><span className="absolute -right-2 -top-2 grid h-[15px] w-[15px] place-items-center rounded-full bg-ink text-[8px] text-white">{count}</span></Link></div></nav></header>{open&&<div className="fixed inset-0 z-50 bg-black/30 md:hidden" onClick={()=>setOpen(false)}><aside className="h-full w-[82%] max-w-[360px] bg-paper p-6" onClick={e=>e.stopPropagation()}><div className="mb-10 flex items-center justify-between"><span className="display-serif text-xl tracking-[.1em]">LUXORA</span><button onClick={()=>setOpen(false)}><X size={21}/></button></div><div className="flex flex-col gap-6">{links.map(([l,h])=><Link key={l} href={h} onClick={()=>setOpen(false)} className="text-xs font-semibold tracking-[.12em]">{l}</Link>)}</div></aside></div>}</>}



"use client";

import Link from "next/link";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useAuth } from "./auth-provider";
import { useState } from "react";
import { useCart } from "./cart-provider";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { user } = useAuth();

  const links = [
    ["NEW IN", "/#new"],
    ["SHOP", "/collections"],
    ["COLLECTIONS", "/collections"],
    ["BEST SELLERS", "/#bestsellers"],
    ["ABOUT USSSSSSS", "/about"],
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="flex h-[34px] items-center justify-center bg-[#171717] px-4 text-[10px] text-white">
        FREE SHIPPING ON ALL ORDERS OVER $100</div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-paper/95 backdrop-blur-md">
        <nav className="container flex h-[76px] items-center justify-between gap-6">
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="display-serif text-[25px] tracking-[.12em]"
          >
            LUXORA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 md:flex">
            {links.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-[10px] font-semibold tracking-[.05em] hover:opacity-60"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Account + Cart */}
          <div className="flex items-center gap-4">
            
            {/* Login / Account */}
            <Link
              href={user ? "/account" : "/login"}
              aria-label={user ? "Account" : "Login"}
            >
              <User size={18} strokeWidth={1.5} />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative" aria-label="Shopping cart">
              <ShoppingBag size={19} strokeWidth={1.5} />

              <span className="absolute -right-2 -top-2 grid h-[15px] w-[15px] place-items-center rounded-full bg-ink text-[8px] text-white">
                {count}
              </span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        >
          <aside
            className="h-full w-[82%] max-w-[360px] bg-paper p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="mb-10 flex items-center justify-between">
              <span className="display-serif text-xl tracking-[.1em]">
                LUXORA
              </span>

              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={21} />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-6">
              {links.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-xs font-semibold tracking-[.12em]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      )}    </>
  );
}