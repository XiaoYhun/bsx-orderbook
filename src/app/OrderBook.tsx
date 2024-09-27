"use client";

import useOrderBookData from "@/hooks/useOrderBookData";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

export default function OrderBook() {
  const { data: orderBookData } = useOrderBookData();
  const [orderBookSize, setOrderBookSize] = useState(10);

  const asks = orderBookData.asks.reverse();
  const bids = orderBookData.bids.reverse();
  const middleValue = { price: 0, gap: 0 };

  if (orderBookData.bids && orderBookData.asks && bids.length > 0 && asks.length > 0) {
    middleValue.price = Math.floor((+asks[asks.length - 1][0] + +bids[0][0]) / 2);
    middleValue.gap = +asks[asks.length - 1][0] - +bids[0][0];
  }

  let cumulative = 0;
  const totalSizeAsks: Record<string, number> = asks.reverse().reduce<Record<string, number>>((acc, [price, size]) => {
    cumulative += +size;
    acc[price] = cumulative;
    return acc;
  }, {});
  cumulative = 0;
  const totalSizeBids: Record<string, number> = bids.reduce<Record<string, number>>((acc, [price, size]) => {
    cumulative += +size;
    acc[price] = cumulative;
    return acc;
  }, {});

  const maxSizeInRange = Math.max(
    ...Object.values(totalSizeAsks).slice(0, orderBookSize),
    ...Object.values(totalSizeBids).slice(-orderBookSize)
  );

  return (
    <div className="max-w-[400px] ">
      <div className="flex flex-col w-[260px] p-3 bg-[#131316] rounded-lg">
        <div className="font-bold text-sm mb-2">Orderbook</div>
        <div className="font-mono">
          {asks
            .reverse()
            .slice(-orderBookSize)
            .map(([price, size]) => (
              <div key={price} className="relative py-1 animate-changeColorRed mb-[1px] overflow-hidden">
                <div
                  className={clsx("absolute inset-0 bg-red-600/40 z-0 transition-all duration-200")}
                  style={{
                    width: `${((+size / maxSizeInRange) * 100) / 2}%`,
                  }}
                ></div>
                <div
                  className={clsx("absolute inset-0 bg-red-600/10 z-0 transition-all duration-200")}
                  style={{
                    width: `${(totalSizeAsks[price] / maxSizeInRange) * 100}%`,
                  }}
                ></div>
                <div className="flex justify-between items-center relative z-[1]">
                  <div className="text-red-700 font-semibold text-xs pl-14">{(+price).toLocaleString()}</div>
                  <div className="text-white/40 text-xs">{(+size).toFixed(3)}</div>
                </div>
              </div>
            ))}
          <div className="flex justify-between bg-white/5 rounded-sm px-1 py-0.5 my-1 -mx-1">
            <div className="pl-10 font-semibold">{(+middleValue.price).toLocaleString()}</div>
            <div>{Math.round(middleValue.gap)}</div>
          </div>
          {bids.slice(0, orderBookSize).map(([price, size]) => (
            <div key={price} className="relative py-1 animate-changeColorGreen mb-[1px] overflow-hidden">
              <div
                className={clsx("absolute inset-0 bg-green-600/40 z-0 transition-all duration-200")}
                style={{
                  width: `${((+size / maxSizeInRange) * 100) / 2}%`,
                }}
              ></div>
              <div
                className={clsx("absolute inset-0 bg-green-600/10 z-0 transition-all duration-200")}
                style={{
                  width: `${(totalSizeBids[price] / maxSizeInRange) * 100}%`,
                }}
              ></div>
              <div className="flex justify-between items-center relative z-[1]">
                <div className="text-green-700 font-semibold text-xs pl-14">{(+price).toLocaleString()}</div>
                <div className="text-white/40 text-xs">{(+size).toFixed(3)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
