import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import { useAppState } from "@/lib/store";

export function ProductSidebar() {
  const { products, demoState } = useAppState();

  return (
    <div className="w-[360px] flex-shrink-0 flex flex-col bg-card">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-display text-base font-semibold">
          {demoState === "returning" ? "For You, Sarah" : "Trending Now"}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {demoState === "returning" ? "Based on your purchase history" : "Best sellers this week"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="product-card"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              {product.tag && (
                <span className="absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                  {product.tag}
                </span>
              )}
            </div>
            <div className="p-3.5">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{product.brand}</p>
              <h4 className="text-sm font-medium mt-0.5 leading-snug">{product.name}</h4>
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-sm font-semibold">{product.price}</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-gold text-gold" />
                  ))}
                </div>
              </div>
              <button className="w-full mt-3 h-8 rounded-md bg-primary text-primary-foreground text-xs font-medium tracking-wide uppercase flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity">
                <ShoppingBag className="w-3 h-3" />
                Add to Bag
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
