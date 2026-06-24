import { NextRequest, NextResponse } from "next/server";
import { getPolicies } from "@/lib/youthApi";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region") ?? undefined;

    const data = await getPolicies({ srchPolyBizSecd: region, pageNum: 1, pageSize: 10 });
    const policies = data.result?.youthPolicyList ?? [];

    const debug = policies.map((p) => ({
        plcyNm: p.plcyNm,
        zipCd: p.zipCd,
        sprvsnInstCdNm: p.sprvsnInstCdNm,
    }));

    return NextResponse.json({ region, debug });
}
