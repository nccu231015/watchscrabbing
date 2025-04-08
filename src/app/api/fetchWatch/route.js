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
        { latestUpdate: { $gte: moment().subtract(60, 'minutes').toDate() } }
      ];
    } else if (bought === "sale") {
      filter.$or = [
        { latestUpdate: { $lt: moment().subtract(60, 'minutes').toDate() } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const products = await watchesss.aggregate([
      { $match: filter },
      { 
        $addFields: {
          latestUpdateDiff: {
            $divide: [
              { $subtract: [new Date(), "$latestUpdate"] },
              60000
            ]
          },
          lastPriceUpdate: {
            $ifNull: [
              { $arrayElemAt: ["$prices.updatedAt", -1] },
              "$latestUpdate"
            ]
          },
          soldPriceUpdate: {
            $let: {
              vars: {
                soldPrice: {
                  $filter: {
                    input: "$prices",
                    as: "price",
                    cond: { $eq: ["$$price.price", "sold"] }
                  }
                }
              },
              in: {
                $ifNull: [
                  { $arrayElemAt: ["$$soldPrice.updatedAt", 0] },
                  null
                ]
              }
            }
          }
        }
      },
      { 
        $addFields: {
          sortTime: {
            $cond: {
              if: { $ne: ["$soldPriceUpdate", null] },
              then: "$soldPriceUpdate",
              else: {
                $cond: {
                  if: { $lte: ["$latestUpdateDiff", 60] },
                  then: "$lastPriceUpdate",
                  else: "$latestUpdate"
                }
              }
            }
          }
        }
      },
      { 
        $sort: { 
          sortTime: -1
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
