
import { NextResponse } from "next/server";
import dotenv from 'dotenv';
import fetchWatchMiddleware from "@/lib/Database/fetchWatch";
import { getpages } from "@/lib/Hook/GetPages";
import { clusterTask } from "@/lib/Hook/StartScrabbing";
import { watchesss } from "@/lib/Database/database";


dotenv.config();

export const maxDuration = 300;
export const dynamic = 'force-dynamic'
export async function GET(req) {

    // if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    // return req.status(401).end('Unauthorized');
    // }

    try {
        const shop = req.headers.get('shop')
        await fetchWatchMiddleware();
        const pages = await getpages(shop);
        // await clusterTask(watchesss,shop,pages);
        console.log(`${shop} 目前有 ${pages} 頁`)
        return NextResponse.json({ data: 'Success', status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
