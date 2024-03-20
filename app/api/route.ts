import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: "Success", data: "Hello, KU Planner!" },
    { status: 200 }
  );
}
