"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Best Sellers", href: "/#best-sellers" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/#contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getItemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-[12px] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#b71c1c] rounded-xl flex items-center justify-center shadow-lg shadow-[#b71c1c]/20">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className={`font-bold text-xl tracking-tight ${scrolled ? "text-[#1a1a1a]" : "text-white"}`}>
              Popcorn
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-[#b71c1c] ${
                  scrolled ? "text-[#1a1a1a]" : "text-white/90 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              className={`p-2 rounded-full transition-colors hidden md:block ${
                scrolled ? "text-[#1a1a1a] hover:text-[#b71c1c]" : "text-white/80 hover:text-white"
              }`}
            >
              <Search className="h-5 w-5" />
            </button>
            <Link href="/wishlist">
              <button
                className={`p-2 rounded-full transition-colors hidden md:block ${
                  scrolled ? "text-[#1a1a1a] hover:text-[#b71c1c]" : "text-white/80 hover:text-white"
                }`}
              >
                <Heart className="h-5 w-5" />
              </button>
            </Link>
            <Link href="/account">
              <button
                className={`p-2 rounded-full transition-colors hidden md:block ${
                  scrolled ? "text-[#1a1a1a] hover:text-[#b71c1c]" : "text-white/80 hover:text-white"
                }`}
              >
                <User className="h-5 w-5" />
              </button>
            </Link>
            <Link href="/cart">
              <Button
                variant={scrolled ? "default" : "outline"}
                size="sm"
                className={`relative rounded-xl ${
                  scrolled
                    ? "bg-[#b71c1c] text-white hover:bg-[#8e1414]"
                    : "border-white/70 text-white hover:bg-white/15 hover:text-white"
                }`}
              >
                <ShoppingBag className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline text-xs font-medium">Cart</span>
                {getItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#b71c1c] text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                    {getItemCount()}
                  </span>
                )}
              </Button>
            </Link>
            <button
              className={`p-2 rounded-full transition-colors md:hidden ${
                scrolled ? "text-[#1a1a1a]" : "text-white"
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[rgba(183,28,28,0.08)]"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 text-[#1a1a1a] font-medium hover:text-[#b71c1c] transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Link href="/account" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full rounded-xl text-sm border-[rgba(183,28,28,0.2)]">
                    <User className="h-4 w-4 mr-2" /> Account
                  </Button>
                </Link>
                <Link href="/shop" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button className="w-full bg-[#b71c1c] hover:bg-[#8e1414] text-white rounded-xl text-sm">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
