"use client";

import useGlobalStore from "@/hooks/useGlobalStore";
import useOrderBookData from "@/hooks/useOrderBookData";
import useProducts from "@/hooks/useProducts";
import { formatPrice, formatPriceWithIncrement } from "@/utils";
import { Skeleton } from "@nextui-org/react";
import clsx from "clsx";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const OrderItem = ({
  price,
  size,
  cumulativeValue,
  maxSizeInRange,
  index,
  isBid,
  base_increment = "1",
  quote_increment = "0.001",
}: {
  price: string;
  size: string;
  cumulativeValue: string;
  maxSizeInRange: number;
  index: number;
  isBid?: boolean;
  base_increment?: string;
  quote_increment?: string;
}) => {
  if (!price) {
    return (
      <div
        key={"null" + index}
        className="relative py-0.5 mb-[2px] overflow-hidden bg-black/10 border-white/10 border-solid"
      >
        <div className="flex justify-between items-center relative z-[1]">
          <div className="font-semibold text-xs pl-14">-</div>
          <div className="text-white/40 text-xs">-</div>
        </div>
      </div>
    );
  }
  return (
    <div
      key={price}
      className={clsx(
        "relative py-0.5 mb-[2px] overflow-hidden",
        isBid ? "animate-changeColorGreen" : "animate-changeColorRed"
      )}
    >
      <div
        className={clsx(
          `absolute inset-0 z-[1] transition-all duration-200`,
          isBid ? "bg-green-600/60" : "bg-red-600/60"
        )}
        style={{
          width: `${((+size / maxSizeInRange) * 100) / 2}%`,
        }}
      ></div>
      <div
        className={clsx(
          `absolute inset-0 z-[1] transition-all duration-200`,
          isBid ? "bg-green-600/20" : "bg-red-600/20"
        )}
        style={{
          width: `${(+cumulativeValue / maxSizeInRange) * 100}%`,
        }}
      ></div>
      <div className="flex justify-between items-center relative z-[2]">
        <div className={clsx(`font-semibold text-xs pl-14`, isBid ? "text-green-700" : "text-red-700")}>
          {formatPriceWithIncrement(price, quote_increment)}
        </div>
        <div className="text-white/40 text-xs">{formatPriceWithIncrement(size, base_increment)}</div>
      </div>
    </div>
  );
};

const OverlayPopup = ({
  x,
  y,
  data,
}: {
  x: number;
  y: number;
  data: { averagePrice: string; amount: string; sum: string };
}) => {
  return createPortal(
    <div
      className="bg-slate-800 shadow-md rounded text-[11px] p-2"
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        border: "1px solid black",
        zIndex: 100,
      }}
    >
      <div className="flex justify-between  min-w-[120px] gap-2">
        <div className="text-white/50">Average Price:</div>
        <div className="text-white">{formatPrice(data.averagePrice)}</div>
      </div>
      <div className="flex justify-between  min-w-[120px] gap-2">
        <div className="text-white/50">Amount:</div>
        <div className="text-white">{data.amount}</div>
      </div>
      <div className="flex justify-between  min-w-[120px] gap-2">
        <div className="text-white/50">Sum:</div>
        <div className="text-white">{formatPrice(data.sum)}</div>
      </div>
    </div>,
    document.body
  );
};

const Overlay = ({ size, data, isReverse }: { size: number; data: string[][]; isReverse?: boolean }) => {
  const [hoveringIndex, setHoveringIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const y = e.clientY - rect.top;
    if (y < 0 || y > rect.height) {
      setHoveringIndex(null);
      return;
    }
    const index = Math.floor((y / rect.height) * size);
    setHoveringIndex(index);
  };

  const hoveringY =
    ((ref.current?.getBoundingClientRect().height || 0) / size) *
    (isReverse ? size - (hoveringIndex || 0) - 1 : hoveringIndex || 0);

  const relativeY = isReverse
    ? (ref.current?.getBoundingClientRect().bottom || 0) - hoveringY
    : (ref.current?.getBoundingClientRect().top || 0) + hoveringY;
  const relativeX =
    (ref.current?.getBoundingClientRect().left || 0) + (ref.current?.getBoundingClientRect().width || 0) + 5;

  const hoveringData: { averagePrice: string; amount: string; sum: string } = useMemo(() => {
    if (!data || hoveringIndex === null) return { averagePrice: "", amount: "", sum: "" };
    const slicedData = isReverse ? data.slice(0, hoveringIndex + 1) : data.slice(hoveringIndex, data.length);
    const sum = slicedData.reduce((acc, [price, size]) => acc + +price * +size, 0);
    const amount = slicedData.reduce((acc, [_, size]) => acc + +size, 0);
    const averagePrice = sum / amount;
    return {
      averagePrice: averagePrice.toFixed(2),
      amount: amount.toFixed(2),
      sum: sum.toFixed(2),
    };
  }, [data, hoveringIndex, isReverse]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-center justify-center z-10 cursor-help"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveringIndex(null)}
    >
      <div className="relative w-full h-full">
        {hoveringIndex !== null && (
          <div
            className={clsx(
              "absolute bg-white/5 inset-x-0 z-20  border-dashed border-white/50",
              isReverse ? "top-0 border-b-2" : "bottom-0 border-t-2"
            )}
            style={{
              top: !isReverse && ref.current ? hoveringY + "px" : 0,
              bottom: isReverse && ref.current ? hoveringY + "px" : 0,
            }}
          >
            <OverlayPopup x={relativeX} y={relativeY} data={hoveringData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default function OrderBook() {
  const { data: orderBookData, isLoading } = useOrderBookData();
  console.log("🚀 ~ OrderBook ~ orderBookData:", orderBookData);
  const [orderBookSize, setOrderBookSize] = useState(10);
  const { productSelected } = useGlobalStore();
  const { data: products } = useProducts();
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
  }, []);
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
    console.log("🚀 ~ OrderBook ~ middleValue:", middleValue.price);

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
    console.log("🚀 ~ renderOrderBook ~ maxSizeInRange:", maxSizeInRange);

    return (
      <div className="font-mono">
        <div className="relative">
          <Overlay size={orderBookSize} data={asksInRange} />
          {asksInRange.map(([price, size, cumulativeValue], index) => (
            <OrderItem
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
  }, [orderBookData, product]);

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
