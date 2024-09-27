import OrderBook from "./OrderBook";
import ProductList from "./ProductList";

export default function Home() {
  return (
    <div className="w-full flex justify-center items-center h-svh">
      <ProductList />
      <OrderBook />
    </div>
  );
}
