import main, { getpages } from "@/lib/main";
import { NextResponse } from "next/server";
import dotenv from 'dotenv';
import fetchWatchMiddleware from "@/lib/Database/fetchWatch";

dotenv.config();

export const maxDuration = 60;
export const dynamic = "force-dynamic"

export async function GET(req) {

    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return req.status(401).end('Unauthorized');
      }

    try {
        const shop = req.headers.get('shop')
        await fetchWatchMiddleware();
        await getpages(shop);
        return NextResponse.json({ data: 'Success', status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
