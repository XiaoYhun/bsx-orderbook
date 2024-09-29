import { IProduct } from "@/api";
import { create } from "apisauce";
import { useQuery } from "react-query";

const api = create({
  baseURL: "/",
  headers: { Accept: "application/json" },
});

export default function useProducts() {
  const { data } = useQuery("products", async () => {
    const response = await api.get<{ data: IProduct[] }>("/api/products");
    return response.data?.data || [];
  });

  return { data };
}
