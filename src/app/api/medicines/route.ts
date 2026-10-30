import { NextRequest, NextResponse } from "next/server";
import { CURATED_MEDICINES } from "@/lib/medicineDatabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase().trim() || "";

    if (!query) {
      return NextResponse.json({ medicines: CURATED_MEDICINES });
    }

    const filtered = CURATED_MEDICINES.filter(
      (med) =>
        med.brandName.toLowerCase().includes(query) ||
        med.genericName.toLowerCase().includes(query) ||
        med.purpose.toLowerCase().includes(query) ||
        med.drugClass.toLowerCase().includes(query)
    );

    return NextResponse.json({ medicines: filtered });
  } catch (error) {
    console.error("Error searching medicines:", error);
    return NextResponse.json({ error: "Failed to search medicines" }, { status: 500 });
  }
}
