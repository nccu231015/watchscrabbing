import main from "@/lib/main";
import { NextResponse } from "next/server";

import cron from 'node-cron'

export async function POST(req, res) {

    try {


        main();


        return NextResponse.json({ data: 'Success', status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }

}