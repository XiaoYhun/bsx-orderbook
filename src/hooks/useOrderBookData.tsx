import { use, useEffect, useState } from "react";
import useGlobalStore from "./useGlobalStore";

interface OrderBookData {
  channel: "book";
  product: string;
  type: "snapshot" | "update";
  data: {
    asks: [string, string][];
    bids: [string, string][];
    timestamp: number;
  };
  timestamp: number;
}

interface OrderBookState {
  bids: Array<Array<string>>;
  asks: Array<Array<string>>;
}

function isOrderBookData(data: any): data is OrderBookData {
  return data?.channel === "book";
}

export default function useOrderBookData(): { data: OrderBookState; isLoading: boolean } {
  const { productSelected } = useGlobalStore();
  const [orderBookState, setOrderBookState] = useState<OrderBookState>({ bids: [], asks: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productSelected) return;

    const socket = new WebSocket("wss://ws.bsx.exchange/ws");

    socket.onopen = () => {
      console.log("connected");
      socket.send(JSON.stringify({ op: "sub", channel: "book", product: productSelected }));
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (isOrderBookData(data)) {
        if (data.type === "snapshot") {
          setIsLoading(false);
          // handle snapshot
          setOrderBookState({
            bids: data.data.bids.sort((a, b) => +b[0] - +a[0]),
            asks: data.data.asks.sort((a, b) => +b[0] - +a[0]),
          });
        }
        if (data.type === "update") {
          // handle update
          setOrderBookState((prev) => {
            const newBids = prev.bids || [];
            const newAsks = prev.asks || [];
            data.data.bids.forEach(([price, size]) => {
              const index = newBids.findIndex((b) => b[0] === price);
              if (index >= 0) {
                if (size === "0") {
                  newBids.splice(index, 1);
                } else {
                  newBids[index] = [price, size];
                }
              } else {
                newBids.push([price, size]);
              }
            });
            data.data.asks.forEach(([price, size]) => {
              const index = newAsks.findIndex((b) => b[0] === price);
              if (index >= 0) {
                if (size === "0") {
                  newAsks.splice(index, 1);
                } else {
                  newAsks[index] = [price, size];
                }
              } else {
                newAsks.push([price, size]);
              }
            });
            return {
              bids: newBids.sort((a, b) => +b[0] - +a[0]),
              asks: newAsks.sort((a, b) => +b[0] - +a[0]),
            };
          });
        }
      }
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
    return () => {
      socket.close();
      setOrderBookState({ asks: [], bids: [] });
      setIsLoading(true);
    };
  }, [productSelected]);

  return { data: orderBookState, isLoading };
}
