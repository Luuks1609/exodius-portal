"use server";

import type { ZodError } from "zod";
import { db } from ".";
import { clients, logs, payments, projects } from "./schema";
import { asc, desc, eq } from "drizzle-orm";
import { Log } from "~/lib/types";

export async function getClients() {
  try {
    const allClients = await db.select().from(clients);
    return {
      success: true,
      status: 200,
      data: allClients,
    };
  } catch (e) {
    const error = e as ZodError;
    return {
      success: false,
      status: 500,
      data: [],
      message: error.message,
    };
  }
}

export async function getPayments() {
  try {
    const allPayments = await db.query.payments.findMany({
      orderBy: [asc(payments.paymentStatus)],
      with: {
        project: {
          columns: {
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      status: 200,
      data: allPayments,
    };
  } catch (e) {
    const error = e as ZodError;
    return {
      success: false,
      status: 500,
      data: [],
      message: error.message,
    };
  }
}

export async function getProjects() {
  try {
    const allProjects = await db.query.projects.findMany({
      orderBy: [asc(payments.id)],
      with: {
        client: {
          columns: {
            companyName: true,
          },
        },
      },
    });

    return {
      success: true,
      status: 200,
      data: allProjects,
    };
  } catch (e) {
    const error = e as ZodError;
    return {
      success: false,
      status: 500,
      data: [],
      message: error.message,
    };
  }
}

export async function getProjectById(id: number) {
  try {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        client: {
          columns: {
            companyName: true,
          },
        },
      },
    });

    if (!project) {
      return {
        success: false,
        status: 404,
        message: "Project not found",
        data: null,
      };
    }

    return {
      success: true,
      status: 200,
      data: project,
    };
  } catch (e) {
    const error = e as ZodError;
    return {
      success: false,
      status: 500,
      data: null,
      message: error.message,
    };
  }
}

export async function getLogs() {
  try {
    const allLogs = await db.query.logs.findMany({
      orderBy: [desc(logs.id)],
    });

    return {
      success: true,
      status: 200,
      data: allLogs as Log[],
    };
  } catch (e) {
    const error = e as ZodError;
    return {
      success: false,
      status: 500,
      data: null,
      message: error.message,
    };
  }
}
