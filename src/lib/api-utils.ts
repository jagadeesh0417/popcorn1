import { NextResponse } from "next/server";

type ResponseInitOptions = { headers?: Record<string, string> };

export function successResponse(data: unknown, status = 200, options?: ResponseInitOptions) {
  return NextResponse.json({ success: true, data }, { status, headers: options?.headers });
}

export function errorResponse(error: string, status = 500) {
  return NextResponse.json({ success: false, error }, { status });
}
