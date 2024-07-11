import main from "@/lib/main";
import { NextResponse } from "next/server";

const AUTH_USER = process.env.CRON_AUTH_USER;
const AUTH_PASS = process.env.CRON_AUTH_PASS;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const [type, credentials] = authHeader.split(' ');

    if (type !== 'Basic') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const decodedCredentials = atob(credentials);
    const [user, pass] = decodedCredentials.split(':');

    if (user !== AUTH_USER || pass !== AUTH_PASS) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        await main();
        return NextResponse.json({ data: 'Success', status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
