import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

export async function generatePDF(data) {
  try {
    const pdfDoc = await PDFDocument.create()

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    let page = pdfDoc.addPage([612, 792])
    const { width, height } = page.getSize()

    let yPosition = height - 50
    const margin = 50
    const lineHeight = 20

    const cleanText = (text) => {
      if (!text) return ""
      return String(text)
        .replace(/[\r\n\t]/g, " ")
        .replace(/[^\x20-\x7E]/g, "")
        .replace(/\s+/g, " ")
        .trim()
    }

    const addText = (text, x, y, font, size, maxWidth = width - 2 * margin) => {
      const cleanedText = cleanText(text)
      if (!cleanedText) return y - lineHeight

      const words = cleanedText.split(" ")
      let line = ""
      let currentY = y

      for (const word of words) {
        const testLine = line + word + " "
        let testWidth

        try {
          testWidth = font.widthOfTextAtSize(testLine, size)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
          console.warn("Error measuring text width, skipping word:", word)
          continue
        }

        if (testWidth > maxWidth && line !== "") {
          try {
            page.drawText(line.trim(), {
              x: x,
              y: currentY,
              size: size,
              font: font,
              color: rgb(0, 0, 0),
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (_error) {
            console.warn("Error drawing text:", line.trim())
          }
          line = word + " "
          currentY -= lineHeight

          if (currentY < 50) {
            page = pdfDoc.addPage([612, 792])
            currentY = height - 50
          }
        } else {
          line = testLine
        }
      }

      if (line.trim() !== "") {
        try {
          page.drawText(line.trim(), {
            x: x,
            y: currentY,
            size: size,
            font: font,
            color: rgb(0, 0, 0),
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
          console.warn("Error drawing final text:", line.trim())
        }
        currentY -= lineHeight
      }

      return currentY
    }

    try {
      page.drawText("AI Interview Report", {
        x: margin,
        y: yPosition,
        size: 24,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      console.warn("Error drawing title")
    }
    yPosition -= 40

    const details = [
      `Domain: ${cleanText(data.role) || "N/A"}`,
      `Experience: ${cleanText(data.experience) || "N/A"}`,
      `Technologies: ${Array.isArray(data.techs) ? data.techs.map(cleanText).join(", ") : "N/A"}`,
      `Date: ${new Date().toLocaleDateString()}`,
      `Total Questions: ${data.interview?.length || 0}`,
      `Average Score: ${cleanText(data.averageScore) || "N/A"}`,
    ]

    for (const detail of details) {
      yPosition = addText(detail, margin, yPosition, helveticaFont, 12)
      yPosition -= 10
    }

    yPosition -= 20

    if (data.summary) {
      try {
        page.drawText("Performance Summary", {
          x: margin,
          y: yPosition,
          size: 16,
          font: helveticaBoldFont,
          color: rgb(0, 0, 0),
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        console.warn("Error drawing summary title")
      }
      yPosition -= 30

      if (data.summary.strengths) {
        try {
          page.drawText("Strengths:", {
            x: margin,
            y: yPosition,
            size: 14,
            font: helveticaBoldFont,
            color: rgb(0, 0.5, 0),
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
          console.warn("Error drawing strengths title")
        }
        yPosition -= 20
        yPosition = addText(data.summary.strengths, margin, yPosition, helveticaFont, 11)
        yPosition -= 20
      }

      if (data.summary.weaknesses) {
        try {
          page.drawText("Areas for Improvement:", {
            x: margin,
            y: yPosition,
            size: 14,
            font: helveticaBoldFont,
            color: rgb(0.8, 0, 0),
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
          console.warn("Error drawing weaknesses title")
        }
        yPosition -= 20
        yPosition = addText(data.summary.weaknesses, margin, yPosition, helveticaFont, 11)
        yPosition -= 30
      }
    }

    if (data.interview && Array.isArray(data.interview)) {
      try {
        page.drawText("Detailed Interview Analysis", {
          x: margin,
          y: yPosition,
          size: 16,
          font: helveticaBoldFont,
          color: rgb(0, 0, 0),
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        console.warn("Error drawing analysis title")
      }
      yPosition -= 30

      data.interview.forEach((item, index) => {
        if (yPosition < 150) {
          page = pdfDoc.addPage([612, 792])
          yPosition = height - 50
        }

        try {
          page.drawText(`Question ${index + 1}:`, {
            x: margin,
            y: yPosition,
            size: 12,
            font: helveticaBoldFont,
            color: rgb(0, 0, 0.8),
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
          console.warn(`Error drawing question ${index + 1} title`)
        }
        yPosition -= 20
        yPosition = addText(item.question || "N/A", margin, yPosition, helveticaFont, 11)
        yPosition -= 15

        try {
          page.drawText("Your Answer:", {
            x: margin,
            y: yPosition,
            size: 12,
            font: helveticaBoldFont,
            color: rgb(0, 0.6, 0),
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
          console.warn(`Error drawing user answer title for question ${index + 1}`)
        }
        yPosition -= 20
        yPosition = addText(item.userAnswer || "N/A", margin, yPosition, helveticaFont, 11)
        yPosition -= 15

        if (item.score) {
          try {
            page.drawText(`Score: ${cleanText(item.score)}/10`, {
              x: margin,
              y: yPosition,
              size: 12,
              font: helveticaBoldFont,
              color: rgb(0.8, 0.4, 0),
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (_error) {
            console.warn(`Error drawing score for question ${index + 1}`)
          }
          yPosition -= 20
        }

        if (item.feedback) {
          try {
            page.drawText("Feedback:", {
              x: margin,
              y: yPosition,
              size: 12,
              font: helveticaBoldFont,
              color: rgb(0.6, 0, 0.6),
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (_error) {
            console.warn(`Error drawing feedback title for question ${index + 1}`)
          }
          yPosition -= 20
          yPosition = addText(item.feedback, margin, yPosition, helveticaFont, 11)
          yPosition -= 15
        }

        if (item.idealAnswer) {
          try {
            page.drawText("Ideal Answer:", {
              x: margin,
              y: yPosition,
              size: 12,
              font: helveticaBoldFont,
              color: rgb(0, 0.4, 0.8),
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (_error) {
            console.warn(`Error drawing ideal answer title for question ${index + 1}`)
          }
          yPosition -= 20
          yPosition = addText(item.idealAnswer, margin, yPosition, helveticaFont, 11)
          yPosition -= 25
        }

        try {
          page.drawLine({
            start: { x: margin, y: yPosition },
            end: { x: width - margin, y: yPosition },
            thickness: 1,
            color: rgb(0.8, 0.8, 0.8),
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
          console.warn(`Error drawing separator line for question ${index + 1}`)
        }
        yPosition -= 20
      })
    }

    const pdfBytes = await pdfDoc.save()
    return pdfBytes
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error("Failed to generate PDF: " + error.message)
  }
}
