import { watchesss } from "@/lib/Database/database";
import fetchWatchMiddleware from "@/lib/Database/fetchWatch";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
export async function GET(request) {
  await fetchWatchMiddleware();

  try {
    const url = new URL(request.url);
    const storeName = url.searchParams.get('store');
    const searchValue = url.searchParams.get('inputvalue');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    let filter = {};
    
    if (storeName) {
      filter["stores"] = storeName;
    }

    if (searchValue) {
      const searchTerms = searchValue.toLowerCase().split(' ');
      filter['name'] = {
        $regex: searchTerms.map(term => `(?=.*${term})`).join(''),
        $options: 'i'
      };
    }

    const skip = (page - 1) * limit;
    
    const products = await watchesss.find(filter)
      .sort({ 
        'prices.0.updatedAt': -1,
        'latestUpdate': -1
      })
      .skip(skip)
      .limit(limit);
    
    const total = await watchesss.countDocuments(filter);

    return NextResponse.json({
      products,
      total,
      hasMore: skip + products.length < total
    });
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
