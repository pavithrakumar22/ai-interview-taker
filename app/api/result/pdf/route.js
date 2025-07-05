import { generatePDF } from "../../../../lib/pdfBuilder.js";

export async function POST(req) {
  try {
    const data = await req.json();
    const pdfBytes = await generatePDF(data);

    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=interview_summary.pdf",
      },
    });
  } catch (err) {
    return Response.json({ error: "PDF generation failed", details: err.message }, { status: 500 });
  }
}
