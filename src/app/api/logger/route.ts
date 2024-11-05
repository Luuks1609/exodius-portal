import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createLog } from "@/server/db/actions";
import type { Log } from "~/lib/types";
import { logSchema } from "@/server/db/schema";

export async function POST(request: NextRequest) {
  const { project, status, message, errorMessage, action } =
    (await request.json()) as Record<string, unknown>;

  // Validatie van binnenkomende data met behulp van Zod schema
  const parsedLogEntry = logSchema.safeParse({
    project,
    status,
    message,
    errorMessage,
    action,
  });

  if (!parsedLogEntry.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid log entry data",
        errors: parsedLogEntry.error.errors,
      },
      { status: 400 },
    );
  }

  const logEntry: Log = parsedLogEntry.data as Log;

  try {
    await createLog(logEntry);
    return NextResponse.json({
      success: true,
      message: "Log created successfully.",
    });
  } catch (error) {
    console.error("Error creating log entry:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create log entry",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
