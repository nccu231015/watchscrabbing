
"use server"
import { watchesss } from "@/lib/Database/database";
import fetchWatchMiddleware from "@/lib/Database/fetchWatch";
import { NextResponse } from "next/server";


// 先跑 npm run dev
// 開啟 local 網址
// 網址後面打 /api/delete?store="相對論鐘錶行"
export async function GET(request){
    await fetchWatchMiddleware();

    const url = new URL(request.url);
    const storeName = url.searchParams.get('store');
    const filter = {
        stores:storeName
    }

    try{
        watchesss.deleteMany({stores:'相對論鐘錶行'}).then(
            result =>{
                console.log(`${result.deletedCount} documents were deleted.`)
            }
        )
        return NextResponse.json(result)
    } catch (err){
        return NextResponse.json({error: err.message})
    }
}