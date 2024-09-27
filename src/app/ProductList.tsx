"use client";

import useGlobalStore from "@/hooks/useGlobalStore";
import useProducts from "@/hooks/useProducts";
import { Select, SelectItem } from "@nextui-org/react";

export default function ProductList() {
  const { data, isLoading } = useProducts();
  const { productSelected, setProductSelected } = useGlobalStore();
  return (
    <div>
      <Select
        label="Select product"
        labelPlacement="outside"
        size="sm"
        variant="flat"
        placeholder="Select product"
        selectedKeys={[productSelected]}
        className="w-[200px]"
        onChange={(e) => setProductSelected(e.target.value)}
        isLoading={isLoading}
      >
        {data.map((product) => (
          <SelectItem key={product.product_id}>{product.product_id}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
