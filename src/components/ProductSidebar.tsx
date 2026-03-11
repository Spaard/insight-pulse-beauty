import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, Package } from "lucide-react";
import { useAppState } from "@/lib/store";

export function ProductSidebar() {
  const { products, revealedProductIds, demoState } = useAppState();

  const visibleProducts = products.filter(p => revealedProductIds.includes(p.id));

  return (
    <div className="w-[360px] flex-shrink-0 flex flex-col bg-card">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-display text-base font-semibold">
          {demoState === "returning" ? "For You, Sarah" : demoState === "abandoned" ? "Your Picks" : "Recommendations"}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {visibleProducts.length === 0
            ? "Products will appear as we chat"
            : `${visibleProducts.length} product${visibleProducts.length > 1 ? "s" : ""} suggested`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        {visibleProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-display text-sm font-semibold">No recommendations yet</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Tell me what you're looking for and I'll suggest the perfect products for you ✨
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {visibleProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1, type: "spring" }}
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
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
