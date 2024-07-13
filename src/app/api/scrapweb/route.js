import { NextResponse } from "next/server";
import dotenv from 'dotenv';
import fetchWatchMiddleware from "@/lib/Database/fetchWatch";
import { clusterTask } from "@/lib/Hook/StartScrabbing";
import { watchpage } from "@/lib/Database/database";
import { watchesss } from "@/lib/Database/database";

dotenv.config();

export const maxDuration = 300;
export const dynamic = 'force-dynamic';


export async function GET(req) {

    // if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    // return req.status(401).end('Unauthorized');
    // }
    try {
        // const shop = req.headers.get('shop')
        const shop = "TT"
        await fetchWatchMiddleware();
        const _pages = await watchpage.where("name").equals(shop)
        const p = _pages[0].pages
        await clusterTask(watchesss,shop,p);
        return NextResponse.json({ data: 'Success', status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
