import { getProducts } from "@/lib/api";

export async function GET(request: Request) {
  const data = await getProducts();
  return Response.json({ data });
}
