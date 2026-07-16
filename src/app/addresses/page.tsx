"use client";

import { motion } from "framer-motion";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AddressesPage() {
  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">My Addresses</h1>
              <p className="text-[#444444] text-sm">Manage your delivery addresses</p>
            </div>
            <Button onClick={() => toast.info("Add address feature coming soon!")}
              className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" /> Add New
            </Button>
          </div>

          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#DC0218]/5 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-[#DC0218]" />
            </div>
            <p className="text-[#444444] text-sm">No addresses saved yet.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
