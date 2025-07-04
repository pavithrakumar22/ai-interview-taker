import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generatePDF(result) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();
  const fontSize = 12;
  let y = height - 50;

  const drawText = (text) => {
    const lines = text.match(/.{1,100}/g); // wrap long lines
    lines.forEach((line) => {
      if (y < 50) {
        y = height - 50;
        pdfDoc.addPage();
      }
      page.drawText(line, {
        x: 50,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= fontSize + 6;
    });
  };

  drawText(`Interview Summary`);
  drawText(`Role: ${result.role}`);
  drawText(`Techs: ${result.techs.join(", ")}`);
  drawText(`Experience: ${result.experience} years`);
  drawText(`Average Score: ${result.averageScore}`);
  drawText(`\nStrengths:\n${result.summary.strengths}`);
  drawText(`\nWeaknesses:\n${result.summary.weaknesses}`);

  result.fullInterview.forEach((item, index) => {
    drawText(`\nQ${index + 1}: ${item.question}`);
    drawText(`Answer: ${item.userAnswer}`);
    drawText(`Score: ${item.score}`);
    drawText(`Ideal: ${item.idealAnswer}`);
    drawText(`Feedback: ${item.feedback}`);
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
