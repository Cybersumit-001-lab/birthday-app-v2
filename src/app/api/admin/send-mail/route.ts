import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { getAllEmployees } from "@/lib/db";
import { sendBirthdayEmail } from "@/lib/mailer";
import { logActivity } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { employeeId } = body;

    const allEmployees = getAllEmployees();
    let targetEmployee = null;

    if (employeeId) {
      targetEmployee = allEmployees.find((e) => e.id === employeeId);
    }

    if (!targetEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const result = await sendBirthdayEmail(targetEmployee, allEmployees);

    logActivity(
      "MAIL_SENT",
      `Birthday card sent to "${targetEmployee.name}" (${targetEmployee.email}) by admin "${session.username}"`,
      session.username
    );

    return NextResponse.json({
      success: true,
      message: `Birthday Card sent to ${targetEmployee.name} (${targetEmployee.email})! 🎉`,
      recipient: targetEmployee.email,
      ccCount: result.ccCount,
      messageId: result.messageId,
    });
  } catch (err: any) {
    logActivity(
      "MAIL_FAILED",
      `Failed to send birthday mail: ${err?.message || "Unknown error"}`,
      session?.username || "unknown"
    );
    return NextResponse.json(
      { error: err?.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
