import { formatPrice } from "@/utils";
import clsx from "clsx";
import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

export default function Overlay({ size, data, isReverse }: { size: number; data: string[][]; isReverse?: boolean }) {
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
}
