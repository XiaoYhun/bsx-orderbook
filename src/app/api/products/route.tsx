import { getProducts } from "@/api";
import { create } from "apisauce";

export async function GET(request: Request) {
  const data = await getProducts();
  return Response.json({ data });
}
