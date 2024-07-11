import main from "@/lib/main";
import { NextResponse } from "next/server";

import cron from 'node-cron'

export dynamic = "force-dynamic"
export maxDuration = 600
export const revalidate = 0
export async function POST(req, res) {

    try {
        main();
        return NextResponse.json({ data: 'Success', status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }

}