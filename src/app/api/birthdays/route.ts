import { NextRequest, NextResponse } from "next/server";
import { getAllEmployees, upsertEmployee, deleteEmployee, updateEmployee } from "@/lib/db";
import { logActivity } from "@/lib/logger";

export async function GET() {
  try {
    const employees = getAllEmployees();
    // Sort by upcoming birthday
    const today = new Date();
    const sorted = [...employees].sort((a, b) => {
      const aDate = new Date(today.getFullYear(), a.birth_month - 1, a.birth_day);
      const bDate = new Date(today.getFullYear(), b.birth_month - 1, b.birth_day);
      if (aDate < today) aDate.setFullYear(today.getFullYear() + 1);
      if (bDate < today) bDate.setFullYear(today.getFullYear() + 1);
      return aDate.getTime() - bDate.getTime();
    });
    return NextResponse.json(sorted);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, birth_month, birth_day } = body;

    if (!name || !email || !birth_month || !birth_day) {
      return NextResponse.json(
        { error: "Name, email, birth month and day are required" },
        { status: 400 }
      );
    }

    const employee = upsertEmployee({
      name,
      email,
      birth_month: Number(birth_month),
      birth_day: Number(birth_day),
    });

    logActivity(
      "EMPLOYEE_ADDED",
      `Employee "${name}" (${email}) registered/updated`,
      "system"
    );

    return NextResponse.json({ success: true, employee });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    const employees = getAllEmployees();
    const target = employees.find((e) => e.id === id);

    const success = deleteEmployee(id);
    if (!success) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    logActivity(
      "EMPLOYEE_DELETED",
      `Employee "${target?.name || id}" deleted`,
      "system"
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, birth_month, birth_day } = body;

    if (!id || !name || !email || !birth_month || !birth_day) {
      return NextResponse.json(
        { error: "id, name, email, birth_month, and birth_day are required" },
        { status: 400 }
      );
    }

    const updated = updateEmployee(id, {
      name,
      email,
      birth_month: Number(birth_month),
      birth_day: Number(birth_day),
    });

    if (!updated) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    logActivity(
      "EMPLOYEE_UPDATED",
      `Employee "${name}" (${email}) updated`,
      "system"
    );

    return NextResponse.json({ success: true, employee: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
