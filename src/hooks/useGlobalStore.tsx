import { create } from "zustand";

interface IGlobalStore {
  productSelected: string;
  setProductSelected: (product: string) => void;
}

const useGlobalStore = create<IGlobalStore>((set) => ({
  productSelected: "",
  setProductSelected: (product: string) => set({ productSelected: product }),
}));

export default useGlobalStore;
