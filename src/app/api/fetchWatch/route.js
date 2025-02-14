import { watchesss } from "@/lib/Database/database";
import fetchWatchMiddleware from "@/lib/Database/fetchWatch";
import { NextResponse } from "next/server";
import moment from "moment";

export const dynamic = 'force-dynamic'
export async function GET(request) {
  await fetchWatchMiddleware();

  try {
    const url = new URL(request.url);
    const storeName = url.searchParams.get('store');
    const searchValue = url.searchParams.get('inputvalue');
    const bought = url.searchParams.get('bought');
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

    if (bought === "unsale") {
      filter.$and = [

        { latestUpdate: { $gte: moment().subtract(720, 'minutes').toDate() } }
      ];
    } else if (bought === "sale") {
      filter.$or = [

        { latestUpdate: { $lt: moment().subtract(720, 'minutes').toDate() } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const products = await watchesss.aggregate([
      { $match: filter },
      { 
        $addFields: {
          latestPriceUpdate: {
            $max: "$prices.updatedAt"
          }
        }
      },
      { 
        $sort: { 
          latestPriceUpdate: -1,

        }
      },
      { $skip: skip },
      { $limit: limit }
    ]);
    
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
