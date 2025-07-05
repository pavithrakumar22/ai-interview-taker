// import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// export async function generatePDF(result) {
//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage();
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   const { width, height } = page.getSize();
//   const fontSize = 12;
//   let y = height - 50;

//   const drawText = (text) => {
//     const lines = text.match(/.{1,100}/g); // wrap long lines
//     lines.forEach((line) => {
//       if (y < 50) {
//         y = height - 50;
//         pdfDoc.addPage();
//       }
//       page.drawText(line, {
//         x: 50,
//         y,
//         size: fontSize,
//         font,
//         color: rgb(0, 0, 0),
//       });
//       y -= fontSize + 6;
//     });
//   };

//   drawText(`Interview Summary`);
//   drawText(`Role: ${result.role}`);
//   drawText(`Techs: ${result.techs.join(", ")}`);
//   drawText(`Experience: ${result.experience} years`);
//   drawText(`Average Score: ${result.averageScore}`);
//   drawText(`\nStrengths:\n${result.summary.strengths}`);
//   drawText(`\nWeaknesses:\n${result.summary.weaknesses}`);

//   result.fullInterview.forEach((item, index) => {
//     drawText(`\nQ${index + 1}: ${item.question}`);
//     drawText(`Answer: ${item.userAnswer}`);
//     drawText(`Score: ${item.score}`);
//     drawText(`Ideal: ${item.idealAnswer}`);
//     drawText(`Feedback: ${item.feedback}`);
//   });

//   const pdfBytes = await pdfDoc.save();
//   return pdfBytes;
// }
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

export async function generatePDF(data) {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()

    // Embed fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Add a page
    let page = pdfDoc.addPage([612, 792]) // Letter size
    const { width, height } = page.getSize()

    let yPosition = height - 50
    const margin = 50
    const lineHeight = 20

    // Helper function to add text with word wrapping
    const addText = (text, x, y, font, size, maxWidth = width - 2 * margin) => {
      const words = text.split(" ")
      let line = ""
      let currentY = y

      for (const word of words) {
        const testLine = line + word + " "
        const testWidth = font.widthOfTextAtSize(testLine, size)

        if (testWidth > maxWidth && line !== "") {
          page.drawText(line.trim(), {
            x: x,
            y: currentY,
            size: size,
            font: font,
            color: rgb(0, 0, 0),
          })
          line = word + " "
          currentY -= lineHeight

          // Add new page if needed
          if (currentY < 50) {
            page = pdfDoc.addPage([612, 792])
            currentY = height - 50
          }
        } else {
          line = testLine
        }
      }

      if (line.trim() !== "") {
        page.drawText(line.trim(), {
          x: x,
          y: currentY,
          size: size,
          font: font,
          color: rgb(0, 0, 0),
        })
        currentY -= lineHeight
      }

      return currentY
    }

    // Title
    page.drawText("AI Interview Report", {
      x: margin,
      y: yPosition,
      size: 24,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    })
    yPosition -= 40

    // Interview Details
    const details = [
      `Domain: ${data.role || "N/A"}`,
      `Experience: ${data.experience || "N/A"}`,
      `Technologies: ${Array.isArray(data.techs) ? data.techs.join(", ") : "N/A"}`,
      `Date: ${new Date().toLocaleDateString()}`,
      `Total Questions: ${data.interview?.length || 0}`,
      `Average Score: ${data.averageScore || "N/A"}`,
    ]

    for (const detail of details) {
      yPosition = addText(detail, margin, yPosition, helveticaFont, 12)
      yPosition -= 10
    }

    yPosition -= 20

    // Summary Section
    if (data.summary) {
      page.drawText("Performance Summary", {
        x: margin,
        y: yPosition,
        size: 16,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      })
      yPosition -= 30

      if (data.summary.strengths) {
        page.drawText("Strengths:", {
          x: margin,
          y: yPosition,
          size: 14,
          font: helveticaBoldFont,
          color: rgb(0, 0.5, 0),
        })
        yPosition -= 20
        yPosition = addText(data.summary.strengths, margin, yPosition, helveticaFont, 11)
        yPosition -= 20
      }

      if (data.summary.weaknesses) {
        page.drawText("Areas for Improvement:", {
          x: margin,
          y: yPosition,
          size: 14,
          font: helveticaBoldFont,
          color: rgb(0.8, 0, 0),
        })
        yPosition -= 20
        yPosition = addText(data.summary.weaknesses, margin, yPosition, helveticaFont, 11)
        yPosition -= 30
      }
    }

    // Detailed Questions and Answers
    if (data.interview && Array.isArray(data.interview)) {
      page.drawText("Detailed Interview Analysis", {
        x: margin,
        y: yPosition,
        size: 16,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      })
      yPosition -= 30

      data.interview.forEach((item, index) => {
        // Check if we need a new page
        if (yPosition < 150) {
          page = pdfDoc.addPage([612, 792])
          yPosition = height - 50
        }

        // Question
        page.drawText(`Question ${index + 1}:`, {
          x: margin,
          y: yPosition,
          size: 12,
          font: helveticaBoldFont,
          color: rgb(0, 0, 0.8),
        })
        yPosition -= 20
        yPosition = addText(item.question || "N/A", margin, yPosition, helveticaFont, 11)
        yPosition -= 15

        // User Answer
        page.drawText("Your Answer:", {
          x: margin,
          y: yPosition,
          size: 12,
          font: helveticaBoldFont,
          color: rgb(0, 0.6, 0),
        })
        yPosition -= 20
        yPosition = addText(item.userAnswer || "N/A", margin, yPosition, helveticaFont, 11)
        yPosition -= 15

        // Score
        if (item.score) {
          page.drawText(`Score: ${item.score}/10`, {
            x: margin,
            y: yPosition,
            size: 12,
            font: helveticaBoldFont,
            color: rgb(0.8, 0.4, 0),
          })
          yPosition -= 20
        }

        // Feedback
        if (item.feedback) {
          page.drawText("Feedback:", {
            x: margin,
            y: yPosition,
            size: 12,
            font: helveticaBoldFont,
            color: rgb(0.6, 0, 0.6),
          })
          yPosition -= 20
          yPosition = addText(item.feedback, margin, yPosition, helveticaFont, 11)
          yPosition -= 15
        }

        // Ideal Answer
        if (item.idealAnswer) {
          page.drawText("Ideal Answer:", {
            x: margin,
            y: yPosition,
            size: 12,
            font: helveticaBoldFont,
            color: rgb(0, 0.4, 0.8),
          })
          yPosition -= 20
          yPosition = addText(item.idealAnswer, margin, yPosition, helveticaFont, 11)
          yPosition -= 25
        }

        // Separator line
        page.drawLine({
          start: { x: margin, y: yPosition },
          end: { x: width - margin, y: yPosition },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8),
        })
        yPosition -= 20
      })
    }

    // Serialize the PDF document to bytes
    const pdfBytes = await pdfDoc.save()
    return pdfBytes
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error("Failed to generate PDF: " + error.message)
  }
}
