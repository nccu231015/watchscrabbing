import { watchesss } from "@/lib/Database/database";
import fetchWatchMiddleware from "@/lib/Database/fetchWatch";
import { NextResponse } from "next/server";

export async function GET(){
    await fetchWatchMiddleware();

    try{
        const products = await watchesss.distinct('stores');
        return NextResponse.json(products)
    } catch (err){
        return NextResponse.json({error: err.message})
    }
}