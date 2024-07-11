import main from "@/lib/main";
import { NextResponse } from "next/server";

import cron from 'node-cron'

export const maxDuration = 600; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req, res) {

    try {
        main();
        return NextResponse.json({ data: 'Success', status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }

}