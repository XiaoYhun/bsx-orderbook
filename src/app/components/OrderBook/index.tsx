"use client";

import useGlobalStore from "@/hooks/useGlobalStore";
import useOrderBookData from "@/hooks/useOrderBookData";
import { formatPriceWithIncrement } from "@/utils";
import { Skeleton } from "@nextui-org/react";
import { useMemo, useRef, useState } from "react";
import Overlay from "./Overlay";
import OrderItem from "./OrderItem";

export default function OrderBook() {
  const { data: orderBookData, isLoading } = useOrderBookData();
  const [orderBookSize, setOrderBookSize] = useState(10);
  const { productSelected, products } = useGlobalStore();
  const product = useMemo(() => {
    return products?.find((p) => p.product_id === productSelected);
  }, [productSelected, products]);

  const renderLoader = useMemo(() => {
    return (
      <div className="flex flex-col gap-[6px]">
        {Array(orderBookSize)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className="h-[16px] w-full rounded-sm !bg-white/5" />
          ))}
        <div className="flex justify-between bg-white/5 rounded-sm px-1 py-1 my-1 -mx-1">
          <div className="pl-10 font-semibold">
            <Skeleton className="h-[14px] w-[70px] rounded-full !bg-white/5" />
          </div>
          <div>
            <Skeleton className="h-[14px] w-[40px] rounded-full !bg-white/5" />
          </div>
        </div>
        {Array(orderBookSize)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className="h-[16px] w-full rounded-sm !bg-white/5" />
          ))}
      </div>
    );
  }, [orderBookSize]);
  const renderOrderBook = useMemo(() => {
    if (!orderBookData || !product) return <div>No data</div>;

    const asks = [...orderBookData.asks];
    const bids = [...orderBookData.bids];

    const middleValue = { price: "", gap: "" };

    if (bids.length > 0 && asks.length > 0) {
      middleValue.price = formatPriceWithIncrement(
        (+asks[asks.length - 1][0] + +bids[0][0]) / 2,
        product.quote_increment
      );
      middleValue.gap = formatPriceWithIncrement(+asks[asks.length - 1][0] - +bids[0][0], product.quote_increment);
    }

    let cumulative = 0;
    for (let i = asks.length - 1; i > 0; i--) {
      cumulative += +asks[i][1];
      asks[i].splice(2, 1, cumulative.toString());
    }
    cumulative = 0;
    for (let i = 0; i < bids.length; i++) {
      cumulative += +bids[i][1];
      bids[i].splice(2, 1, cumulative.toString());
    }

    const asksInRange = asks.slice(-orderBookSize);
    if (asksInRange.length < orderBookSize) {
      asksInRange.unshift(...Array(orderBookSize - asksInRange.length).fill([0, 0, 0]));
    }
    const bidsInRange = bids.slice(0, orderBookSize);
    if (bidsInRange.length < orderBookSize) {
      bidsInRange.push(...Array(orderBookSize - bidsInRange.length).fill([0, 0, 0]));
    }

    const maxSizeInRange = Math.max(...asksInRange.map((a) => +a[2] || 0), ...bidsInRange.map((a) => +a[2] || 0));

    return (
      <div className="font-mono">
        <div className="relative">
          <Overlay size={orderBookSize} data={asksInRange} />
          {asksInRange.map(([price, size, cumulativeValue], index) => (
            <OrderItem
              key={price}
              price={price}
              size={size}
              cumulativeValue={cumulativeValue}
              index={index}
              maxSizeInRange={maxSizeInRange}
              base_increment={product?.base_increment}
              quote_increment={product?.quote_increment}
            />
          ))}
        </div>

        <div className="flex justify-between bg-white/5 rounded-sm px-1 py-0.5 my-1 -mx-1">
          <div className="pl-10 font-semibold">{middleValue.price ? middleValue.price : "-"}</div>
          <div>{middleValue.gap || "-"}</div>
        </div>
        <div className="relative">
          <Overlay size={orderBookSize} data={bidsInRange} isReverse />
          {bidsInRange.map(([price, size, cumulativeValue], index) => (
            <OrderItem
              key={price}
              isBid
              price={price}
              size={size}
              cumulativeValue={cumulativeValue}
              index={index}
              maxSizeInRange={maxSizeInRange}
              base_increment={product?.base_increment}
              quote_increment={product?.quote_increment}
            />
          ))}
        </div>
      </div>
    );
  }, [orderBookData, product, orderBookSize]);

  if (!product) return <div>No data</div>;

  return (
    <div className="w-full">
      <div className="flex flex-col w-full p-3 bg-slate-900 rounded-lg">
        <div className="font-bold text-sm mb-2">Orderbook</div>
        {isLoading ? renderLoader : renderOrderBook}
      </div>
    </div>
  );
}
