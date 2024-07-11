import main from "@/lib/main";
import { NextResponse } from "next/server";

import cron from 'node-cron'

export async function POST(req, res) {

    try {

        cron.schedule('*/30 * * * *', async () => {
            console.log("the scrabbing has started")
            main();
        });

        return NextResponse.json({ data: 'Success', status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }

}