// src/app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout realizado" });

  // Mata o cookie definindo validade 0
  response.cookies.set("session_token", "", {
    maxAge: 0,
    path: "/",
  });

  return response;
}
