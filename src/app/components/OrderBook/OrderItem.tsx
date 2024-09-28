import { formatPriceWithIncrement } from "@/utils";
import clsx from "clsx";

export default function OrderItem({
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
}) {
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
}
