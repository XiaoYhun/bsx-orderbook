"use client";
import ProductList from "./ProductList";
import { Button, Divider } from "@nextui-org/react";
import OrderBook from "./OrderBook";
import { useEffect, useState } from "react";

import Image from "next/image";
import useGlobalStore from "@/hooks/useGlobalStore";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ProductDetail from "./ProductDetail";
import useProducts from "@/hooks/useProducts";
import clsx from "clsx";

const transition = {
  ease: [0, 0.5, 0.4, 1],
  duration: 0.5,
};

export default function Wrapper() {
  const [isBooting, setIsBooting] = useState(true);
  const { productSelected, setProductSelected } = useGlobalStore();

  // prefetch products
  useProducts();

  useEffect(() => {
    setTimeout(() => {
      setIsBooting(false);
    }, 2000);
  }, []);

  return (
    <div className="gap-4 bg-slate-950 p-3 rounded-xl shadow-2xl h-[600px] relative z-10 opacity-95">
      <motion.div
        layoutId="mainLayout"
        animate={productSelected ? { width: "600px" } : { width: "500px" }}
        style={{ width: "500px" }}
        className={clsx("relative flex h-full items-center justify-center overflow-hidden")}
      >
        <AnimatePresence mode="sync">
          {isBooting ? (
            <motion.div
              key={"logo"}
              className="animate-pulse flex items-center justify-center flex-1"
              transition={transition}
            >
              <Image src="https://app.bsx.exchange/assets/logo-nav-full.svg" width={180} height={60} alt="logo" />
            </motion.div>
          ) : (
            <>
              <motion.div
                key={"product-list"}
                initial={{ y: 50, opacity: 0 }}
                animate={!productSelected ? { x: 0, opacity: 1, y: 0 } : { x: "-100%", opacity: 0, y: 0 }}
                transition={{
                  ease: [0, 0.5, 0.4, 1],
                  duration: 0.5,
                }}
                className="flex flex-col gap-2 items-center justify-center flex-1 absolute w-full"
              >
                <div className="font-semibold">Product list:</div>
                <ProductList />
              </motion.div>

              <motion.div
                key={"product-detail"}
                initial={{ x: "100%", opacity: 0 }}
                animate={productSelected ? { x: "0%", opacity: 1 } : { x: "100%", opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ ease: [0, 0.5, 0.4, 1], duration: 0.5 }}
                className="flex-1 absolute w-full h-full"
              >
                <div className="flex gap-1 items-center mb-1">
                  <Button isIconOnly radius="full" size="sm" onPress={() => setProductSelected("")} variant="light">
                    <ArrowLeft size={16} />
                  </Button>
                  <motion.div layoutId={productSelected} className="font-bold">
                    {productSelected}
                  </motion.div>
                </div>
                <div className="flex gap-3 w-full items-stretch">
                  <div className="flex-1">
                    <ProductDetail />
                  </div>
                  <div className="self-stretch !w-[1px] bg-white/10 relative" />
                  <div className="flex-1">
                    <OrderBook />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
