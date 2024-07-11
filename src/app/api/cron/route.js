import main from "@/lib/main";
import { NextResponse } from "next/server";

import cron from 'node-cron'

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req, res) {

    
    try {
        if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
            return res.status(401).end('Unauthorized');
          }
          
        main();
        return NextResponse.json({ data: 'Success', status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }

}