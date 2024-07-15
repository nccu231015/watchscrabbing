import { watchesss } from "@/lib/Database/database";
import fetchWatchMiddleware from "@/lib/Database/fetchWatch";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  await fetchWatchMiddleware();

  try {
    const url = new URL(request.url);
    const storeName = url.searchParams.get('store');
    const Name = url.searchParams.get('inputvalue');
    let filter = {};
    if (storeName) {
      filter["stores"] = storeName;
    }
    if (Name) {
      filter['name'] = { $regex: new RegExp(Name, 'i') };
    }

    const products = await watchesss.find(filter);
    
    products.forEach(product => {
      product.prices.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    });
    
    products.sort((a, b) => {
      const aLatestUpdate = a.prices.length > 0 ? new Date(a.prices[0].updatedAt) : new Date(0);
      const bLatestUpdate = b.prices.length > 0 ? new Date(b.prices[0].updatedAt) : new Date(0);
      return bLatestUpdate - aLatestUpdate;
    });

    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
