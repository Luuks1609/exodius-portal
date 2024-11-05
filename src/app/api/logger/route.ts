import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createLog } from "@/server/db/actions";
import type { Log } from "~/lib/types";
import { logSchema } from "@/server/db/schema";

const LOGGER_API_KEY = process.env.LOGGER_API_KEY;

export async function POST(request: NextRequest) {
  console.log("Received POST request");

  const apiKey = request.headers.get("x-api-key");
  console.log("API Key from request:", apiKey);

  // Check if the provided API key matches the one in the environment variables
  if (apiKey !== LOGGER_API_KEY) {
    console.warn("Unauthorized access attempt with API Key:", apiKey);
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized access",
      },
      { status: 403 },
    );
  }

  const requestBody = await request.json();
  console.log("Request body:", requestBody);

  const { project, status, message, errorMessage, action } =
    requestBody as Record<string, unknown>;

  // Validatie van binnenkomende data met behulp van Zod schema
  const parsedLogEntry = logSchema.safeParse({
    project,
    status,
    message,
    errorMessage,
    action,
  });

  if (!parsedLogEntry.success) {
    console.error("Invalid log entry data:", parsedLogEntry.error.errors);
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
  console.log("Parsed log entry:", logEntry);

  try {
    await createLog(logEntry);
    console.log("Log created successfully:", logEntry);
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
