import { getProducts, IProduct } from "@/api";
import { create } from "zustand";

interface IGlobalStore {
  productSelected: string;
  products: IProduct[];
  setProductSelected: (product: string) => void;
  setProducts: (products: IProduct[]) => void;
}

const useGlobalStore = create<IGlobalStore>((set) => ({
  productSelected: "",
  products: [],
  setProductSelected: (product: string) => set({ productSelected: product }),
  setProducts: (products: IProduct[]) => set({ products: products }),
}));

export default useGlobalStore;
