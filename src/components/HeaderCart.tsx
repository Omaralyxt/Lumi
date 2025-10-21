"use client";

import { useCart } from "@/context/CartContext";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function HeaderCart() {
  const { cartCount } = useCart();
  const location = useLocation();

  // Se já estiver na página de carrinho ou checkout, não mostrar o botão
  if (location.pathname === "/cart" || location.pathname === "/checkout") {
    return null;
  }

  return (
    <Button asChild variant="ghost" size="sm" className="relative">
      <Link to="/cart">
        <ShoppingCart className="h-5 w-5" />
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2"
            >
              <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
                {cartCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </Button>
  );
}