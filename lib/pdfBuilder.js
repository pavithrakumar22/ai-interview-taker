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

    // Helper function to clean text and remove problematic characters
    const cleanText = (text) => {
      if (!text) return ""
      return String(text)
        .replace(/[\r\n\t]/g, " ") // Replace newlines, carriage returns, and tabs with spaces
        .replace(/[^\x20-\x7E]/g, "") // Remove non-printable ASCII characters
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .trim()
    }

    // Helper function to add text with word wrapping
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
        } catch (error) {
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
          } catch (error) {
            console.warn("Error drawing text:", line.trim())
          }
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
        try {
          page.drawText(line.trim(), {
            x: x,
            y: currentY,
            size: size,
            font: font,
            color: rgb(0, 0, 0),
          })
        } catch (error) {
          console.warn("Error drawing final text:", line.trim())
        }
        currentY -= lineHeight
      }

      return currentY
    }

    // Title
    try {
      page.drawText("AI Interview Report", {
        x: margin,
        y: yPosition,
        size: 24,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      })
    } catch (error) {
      console.warn("Error drawing title")
    }
    yPosition -= 40

    // Interview Details
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

    // Summary Section
    if (data.summary) {
      try {
        page.drawText("Performance Summary", {
          x: margin,
          y: yPosition,
          size: 16,
          font: helveticaBoldFont,
          color: rgb(0, 0, 0),
        })
      } catch (error) {
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
        } catch (error) {
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
        } catch (error) {
          console.warn("Error drawing weaknesses title")
        }
        yPosition -= 20
        yPosition = addText(data.summary.weaknesses, margin, yPosition, helveticaFont, 11)
        yPosition -= 30
      }
    }

    // Detailed Questions and Answers
    if (data.interview && Array.isArray(data.interview)) {
      try {
        page.drawText("Detailed Interview Analysis", {
          x: margin,
          y: yPosition,
          size: 16,
          font: helveticaBoldFont,
          color: rgb(0, 0, 0),
        })
      } catch (error) {
        console.warn("Error drawing analysis title")
      }
      yPosition -= 30

      data.interview.forEach((item, index) => {
        // Check if we need a new page
        if (yPosition < 150) {
          page = pdfDoc.addPage([612, 792])
          yPosition = height - 50
        }

        // Question
        try {
          page.drawText(`Question ${index + 1}:`, {
            x: margin,
            y: yPosition,
            size: 12,
            font: helveticaBoldFont,
            color: rgb(0, 0, 0.8),
          })
        } catch (error) {
          console.warn(`Error drawing question ${index + 1} title`)
        }
        yPosition -= 20
        yPosition = addText(item.question || "N/A", margin, yPosition, helveticaFont, 11)
        yPosition -= 15

        // User Answer
        try {
          page.drawText("Your Answer:", {
            x: margin,
            y: yPosition,
            size: 12,
            font: helveticaBoldFont,
            color: rgb(0, 0.6, 0),
          })
        } catch (error) {
          console.warn(`Error drawing user answer title for question ${index + 1}`)
        }
        yPosition -= 20
        yPosition = addText(item.userAnswer || "N/A", margin, yPosition, helveticaFont, 11)
        yPosition -= 15

        // Score
        if (item.score) {
          try {
            page.drawText(`Score: ${cleanText(item.score)}/10`, {
              x: margin,
              y: yPosition,
              size: 12,
              font: helveticaBoldFont,
              color: rgb(0.8, 0.4, 0),
            })
          } catch (error) {
            console.warn(`Error drawing score for question ${index + 1}`)
          }
          yPosition -= 20
        }

        // Feedback
        if (item.feedback) {
          try {
            page.drawText("Feedback:", {
              x: margin,
              y: yPosition,
              size: 12,
              font: helveticaBoldFont,
              color: rgb(0.6, 0, 0.6),
            })
          } catch (error) {
            console.warn(`Error drawing feedback title for question ${index + 1}`)
          }
          yPosition -= 20
          yPosition = addText(item.feedback, margin, yPosition, helveticaFont, 11)
          yPosition -= 15
        }

        // Ideal Answer
        if (item.idealAnswer) {
          try {
            page.drawText("Ideal Answer:", {
              x: margin,
              y: yPosition,
              size: 12,
              font: helveticaBoldFont,
              color: rgb(0, 0.4, 0.8),
            })
          } catch (error) {
            console.warn(`Error drawing ideal answer title for question ${index + 1}`)
          }
          yPosition -= 20
          yPosition = addText(item.idealAnswer, margin, yPosition, helveticaFont, 11)
          yPosition -= 25
        }

        // Separator line
        try {
          page.drawLine({
            start: { x: margin, y: yPosition },
            end: { x: width - margin, y: yPosition },
            thickness: 1,
            color: rgb(0.8, 0.8, 0.8),
          })
        } catch (error) {
          console.warn(`Error drawing separator line for question ${index + 1}`)
        }
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
