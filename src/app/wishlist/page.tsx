"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-20 h-20 rounded-full bg-[#DC0218]/5 flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-[#DC0218]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">My Wishlist</h1>
          <p className="text-[#444444] mt-2 text-sm">Your saved favourites will appear here.</p>
          <Link href="/shop">
            <Button className="mt-6 bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl">
              Browse Flavours
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
