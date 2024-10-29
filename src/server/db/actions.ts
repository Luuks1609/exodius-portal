"use server";

import { eq } from "drizzle-orm";
import { db } from ".";
import {
  clientFormSchema,
  clients,
  paymentFormSchema,
  payments,
  projectFormSchema,
  projects,
} from "./schema";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

export const transformZodErrors = (error: ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

const handleDatabaseError = (error: unknown, action: string) => {
  console.error(error);
  if (error instanceof ZodError) {
    return {
      errors: transformZodErrors(error),
      data: null,
    };
  }
  return {
    errors: {
      message: `An unexpected error occurred. Could not ${action} client.`,
    },
    data: null,
  };
};

export async function createClient(formData: FormData) {
  try {
    const parsedData = clientFormSchema.parse({
      companyName: formData.get("companyName"),
      contactName: formData.get("contactName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    });

    await db.insert(clients).values(parsedData);
    revalidatePath("/dashboard/clients");

    return {
      data: "Client created successfully",
      errors: null,
    };
  } catch (error) {
    return handleDatabaseError(error, "create");
  }
}

export async function updateClient(clientId: number, formData: FormData) {
  try {
    const parsedData = clientFormSchema.parse({
      companyName: formData.get("companyName"),
      contactName: formData.get("contactName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    });

    await db.update(clients).set(parsedData).where(eq(clients.id, clientId));
    revalidatePath("/dashboard/clients");

    return {
      data: "Client updated successfully",
      errors: null,
    };
  } catch (error) {
    return handleDatabaseError(error, "update");
  }
}

export async function deleteClient(clientId: number) {
  try {
    await db.delete(clients).where(eq(clients.id, clientId));
    revalidatePath("/dashboard/clients");

    return {
      data: "Client deleted successfully",
      errors: null,
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {
        message: "An unexpected error occurred. Could not delete client.",
      },
      data: null,
    };
  }
}

export async function createPayment(formData: FormData) {
  try {
    const parsedData = paymentFormSchema.parse({
      projectId: Number(formData.get("projectId")),
      amount: Number(formData.get("amount")),
      date: formData.get("date"),
      paymentType: formData.get("paymentType"),
      recurringFrequency: formData.get("recurringFrequency"),
      paymentStatus: Number(formData.get("paymentStatus")),
    });

    await db.insert(payments).values(parsedData);
    revalidatePath("/dashboard/payments");

    return {
      data: "Payment created successfully",
      errors: null,
    };
  } catch (error) {
    return handleDatabaseError(error, "create");
  }
}

export async function updatePayment(paymentId: number, formData: FormData) {
  try {
    const parsedData = paymentFormSchema.parse({
      projectId: Number(formData.get("projectId")),
      amount: Number(formData.get("amount")),
      date: formData.get("date"),
      paymentType: formData.get("paymentType"),
      recurringFrequency: formData.get("recurringFrequency"),
      paymentStatus: Number(formData.get("paymentStatus")),
    });

    await db.update(payments).set(parsedData).where(eq(payments.id, paymentId));
    revalidatePath("/dashboard/payments");

    return {
      data: "Payment updated successfully",
      errors: null,
    };
  } catch (error) {
    return handleDatabaseError(error, "update");
  }
}

export async function deletePayment(paymentId: number) {
  try {
    await db.delete(payments).where(eq(payments.id, paymentId));
    revalidatePath("/dashboard/payments");

    return {
      data: "Payment deleted successfully",
      errors: null,
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {
        message: "An unexpected error occurred. Could not delete paymemt.",
      },
      data: null,
    };
  }
}

export async function createProject(formData: FormData) {
  try {
    const parsedData = projectFormSchema.parse({
      clientId: Number(formData.get("clientId")),
      name: formData.get("name"),
      description: formData.get("description"),
      notes: formData.get("notes"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
    });

    const [newProject] = await db
      .insert(projects)
      .values(parsedData)
      .returning();
    revalidatePath("/dashboard/projects");

    return {
      data: newProject,
      errors: null,
    };
  } catch (error) {
    return handleDatabaseError(error, "create");
  }
}

export async function updateProject(projectId: number, formData: FormData) {
  try {
    const parsedData = projectFormSchema.parse({
      clientId: Number(formData.get("clientId")),
      name: formData.get("name"),
      description: formData.get("description"),
      notes: formData.get("notes"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
    });

    await db.update(projects).set(parsedData).where(eq(projects.id, projectId));
    revalidatePath("/dashboard/projects");

    return {
      data: "Project updated successfully",
      errors: null,
    };
  } catch (error) {
    return handleDatabaseError(error, "update");
  }
}

export async function deleteProject(projectId: number) {
  try {
    await db.delete(projects).where(eq(projects.id, projectId));
    revalidatePath("/dashboard/projects");

    console.log(projects.id);
    console.log(projectId);

    return {
      data: "Project deleted successfully",
      errors: null,
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {
        message: "An unexpected error occurred. Could not delete project.",
      },
      data: null,
    };
  }
}
