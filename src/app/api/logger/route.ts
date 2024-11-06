import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createLog } from "@/server/db/actions";
import type { Log } from "~/lib/types";
import { logSchema } from "@/server/db/schema";
import { env } from "~/env";
import { DiscordClient } from "~/lib/discord-client";

const LOGGER_API_KEY = env.LOGGER_API_KEY;

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");

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

  const { project, status, message, errorMessage, action } =
    (await request.json()) as Record<string, unknown>;

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

  try {
    await createLog(logEntry);

    // Check if the status is false and send a Discord notification
    if (logEntry.status === "failed") {
      console.log("ran?");
      const discord = new DiscordClient(env.DISCORD_BOT_TOKEN);
      await discord.sendEmbedToChannel(env.DISCORD_CHANNEL_ID, {
        title: "Log Entry Failed",
        description: `Project: ${logEntry.project}\nMessage: ${logEntry.message}\nError: ${logEntry.errorMessage}\nAction:${logEntry.action}`,
        color: 0xff0000, // Red color for failure
      });
      // await sendDiscordNotification(logEntry); // Call the function to send a notification
    }

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
