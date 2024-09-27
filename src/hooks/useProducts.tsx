import { api } from "@/api";
import { useEffect, useState } from "react";

interface IProduct {
  index: number;
  product_id: string;
  base_asset_symbol: string;
  quote_asset_symbol: string;
  underlying: string;
  base_increment: string;
  quote_increment: string;
  display_name: string;
  is_active: boolean;
  perpetual_product_config: {
    initial_margin: string;
    maintenance_margin: string;
    max_leverage: string;
  };
  quote_volume_24h: string;
  change_24h: string;
  high_24h: string;
  low_24h: string;
  last_price: string;
  mark_price: string;
  index_price: string;
  max_position_size: string;
  open_interest: string;
  funding_interval: string;
  next_funding_rate: string;
  next_funding_time: string;
  post_only: boolean;
  last_cumulative_funding: string;
  min_order_size: string;
  predicted_funding_rate: string;
  visible: boolean;
  display_base_asset_symbol: string;
}

export default function useProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    api.get<{ products: IProduct[] }>("/products").then((response) => {
      response.data;
      if (response.ok) {
        setProducts(response.data?.products || []);
      } else {
        throw new Error(response.problem);
      }
      setIsLoading(false);
    });
  }, []);
  return { data: products, isLoading };
}
