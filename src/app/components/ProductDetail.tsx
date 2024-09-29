import useGlobalStore from "@/hooks/useGlobalStore";
import useProducts from "@/hooks/useProducts";
import { formatPrice, formatPriceWithIncrement } from "@/utils";
import clsx from "clsx";
import { useEffect, useState } from "react";

const Timer = ({ time }: { time: number }) => {
  const [seconds, setSeconds] = useState(time);
  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    const diff = time - now;
    setSeconds(diff);
    const interval = setInterval(() => {
      setSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);
  return (
    <span>
      {Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0")}
      :{(seconds % 60).toString().padStart(2, "0")}
    </span>
  );
};

export default function ProductDetail() {
  const { productSelected } = useGlobalStore();
  const { data: products } = useProducts();
  const product = products?.find((p) => p.product_id === productSelected);
  if (!product) return <div>No product data</div>;

  return (
    <div className="w-full">
      <div className="bg-slate-900 rounded-lg p-1 col-span-2 row-span-2 items-center flex justify-center font-bold text-2xl w-2/3 py-6 mb-4">
        ${formatPriceWithIncrement(product.last_price, product.quote_increment)}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 rounded-lg p-1.5 px-2 flex flex-col gap-1.5">
          <div className="text-[11px] text-white/50 text-nowrap">Mark price</div>{" "}
          <div className="text-xs font-bold">
            ${formatPriceWithIncrement(product.mark_price, product.quote_increment)}
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-1.5 px-2 flex flex-col gap-1.5">
          <div className="text-[11px] text-white/50 text-nowrap">Index price</div>{" "}
          <div className="text-xs font-bold">
            ${formatPriceWithIncrement(product.index_price, product.quote_increment)}
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-1.5 px-2 flex flex-col gap-1.5">
          <div className="text-[11px] text-white/50 text-nowrap">24h Change</div>{" "}
          <div className={clsx("text-xs font-bold", +product.change_24h > 0 ? "text-green-500" : "text-red-500")}>
            ${formatPriceWithIncrement(product.change_24h, product.quote_increment)}{" "}
            <span className="text-[10px] font-normal">
              ({((+product.change_24h / +product.last_price) * 100).toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-1.5 px-2 flex flex-col gap-1.5">
          <div className="text-[11px] text-white/50 text-nowrap">24h Volume</div>{" "}
          <div className="text-xs font-bold">${formatPrice(Math.floor(+product.quote_volume_24h))}</div>
        </div>
        <div className="bg-slate-900 rounded-lg p-1.5 px-2 flex flex-col gap-1.5">
          <div className="text-[10px] text-white/50 text-nowrap">Open Interest</div>{" "}
          <div className="text-xs font-bold">
            {formatPrice(product.open_interest)}
            <span className="text-[11px] font-normal text-white/50"> {product.base_asset_symbol}</span>
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-1.5 px-2 flex flex-col gap-1">
          <div className="text-[11px] text-white/50 text-nowrap">Next Funding</div>{" "}
          <div className="text-xs font-bold">
            <Timer time={+product.next_funding_time.slice(0, -9)} />
          </div>
        </div>
      </div>
    </div>
  );
}
