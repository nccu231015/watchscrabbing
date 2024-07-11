import main from "@/lib/main";
import { NextResponse } from "next/server";
import dotenv from 'dotenv';

dotenv.config();


export async function GET(req) {

    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
      }
      
    try {
        await main();
        return NextResponse.json({ data: 'Success', status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
