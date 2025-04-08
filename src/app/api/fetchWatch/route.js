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
        { latestUpdate: { $gte: moment().utc().subtract(720, 'minutes').toDate() } }
      ];
    } else if (bought === "sale") {
      filter.$or = [
        { latestUpdate: { $lt: moment().utc().subtract(720, 'minutes').toDate() } }
      ];
    }

    const skip = (page - 1) * limit;
    
    // 先獲取所有符合條件的數據的 ID 和排序值
    const allProducts = await watchesss.aggregate([
      { $match: filter },
      { 
        $addFields: {
          latestPriceUpdate: {
            $cond: {
              if: {
                $lt: [
                  { $max: "$latestUpdate" },
                  moment().utc().subtract(720, 'minutes').toDate()
                ]
              },
              then: "$latestUpdate",
              else: { $max: "$prices.updatedAt" }
            }
          }
        }
      },
      { 
        $sort: { 
          latestPriceUpdate: -1
        }
      },
      {
        $project: {
          _id: 1,
          latestPriceUpdate: 1
        }
      }
    ]);
    
    // 獲取當前頁需要的 ID
    const pageIds = allProducts.slice(skip, skip + limit).map(p => p._id);
    
    // 使用 ID 列表獲取完整的商品數據
    const products = await watchesss.aggregate([
      {
        $match: {
          _id: { $in: pageIds }
        }
      },
      {
        $addFields: {
          sortOrder: {
            $indexOfArray: [pageIds, "$_id"]
          }
        }
      },
      {
        $sort: {
          sortOrder: 1
        }
      }
    ]);
    
    const total = allProducts.length;

    return NextResponse.json({
      products,
      total,
      hasMore: skip + products.length < total
    });
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
