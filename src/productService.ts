import type { Product } from "./types/Product";

export async function fetchRandomProduct(): Promise<Product> {
  const res = await fetch("https://dummyjson.com/products");

  if (!res.ok) {
    throw new Error("Tuotteiden hakeminen epäonnistui");
  }

  const data = await res.json();
  const products = data.products as Product[];

  const randomIndex = Math.floor(Math.random() * products.length);
  return products[randomIndex];
}