"use client";

import useGlobalStore from "@/hooks/useGlobalStore";
import useProducts from "@/hooks/useProducts";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ProductList() {
  const { productSelected, setProductSelected } = useGlobalStore();
  const { data: products } = useProducts();
  return (
    <div>
      <div className="flex flex-col gap-1 min-w-[200px]">
        {products ? (
          products
            .filter((p) => p.visible)
            .map((product) => (
              <div
                key={product.product_id}
                className={clsx(
                  "px-2 py-1 hover:bg-primary-400 rounded cursor-pointer bg-slate-400/10 group flex justify-between items-center transition-all",
                  productSelected === product.product_id && "bg-white/20"
                )}
                onClick={() => setProductSelected(product.product_id)}
              >
                <motion.div layoutId={product.product_id} className="font-bold w-fit">
                  {product.product_id}
                </motion.div>
                <ArrowRight
                  className="group-hover:translate-x-0 opacity-0 group-hover:opacity-100 duration-200 -translate-x-2"
                  size={16}
                />
              </div>
            ))
        ) : (
          <div>No data</div>
        )}
      </div>
    </div>
  );
}
