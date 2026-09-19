import { NextRequest, NextResponse } from "next/server";
import { getAllEmployees } from "@/lib/db";
import { sendBirthdayEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { employeeId, email } = body;

    const allEmployees = getAllEmployees();
    let targetEmployee = null;

    if (employeeId) {
      targetEmployee = allEmployees.find((e) => e.id === employeeId);
    } else if (email) {
      targetEmployee = allEmployees.find(
        (e) => e.email.toLowerCase() === email.trim().toLowerCase()
      );
    } else {
      // Default: Find today's birthday person
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      targetEmployee = allEmployees.find(
        (e) => e.birth_month === month && e.birth_day === day
      );
    }

    if (!targetEmployee) {
      // If no target employee found, use first employee or return helpful message
      if (allEmployees.length > 0) {
        targetEmployee = allEmployees[0];
      } else {
        return NextResponse.json(
          { error: "No employee found in directory to send email to." },
          { status: 404 }
        );
      }
    }

    // Trigger zero-interaction automated server-side email send with HTML Birthday Card
    const result = await sendBirthdayEmail(targetEmployee, allEmployees);

    return NextResponse.json({
      success: true,
      message: `Birthday Card email automatically sent to ${targetEmployee.name} (${targetEmployee.email})! 🎉`,
      recipient: targetEmployee.email,
      ccCount: result.ccCount,
      messageId: result.messageId,
    });
  } catch (err: any) {
    console.error("Failed to automatically send birthday email:", err);
    return NextResponse.json(
      {
        error:
          err?.message ||
          "Failed to send email via SMTP. Please check server credentials.",
      },
      { status: 500 }
    );
  }
}
