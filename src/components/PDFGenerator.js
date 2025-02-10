import React from "react";
import jsPDF from "jspdf";

const productInstructions = {
  "New Line Cleanser": "Use daily in AM / PM.",
  "New Line Facial Peel": "Apply a thin layer all over the face. Avoid the eye area. Leave on for 1 min then massage in circle motions all over the face and rinse with warm water. Repeat 1x a week.",
  "New Line Day Cream": "Use daily every AM after cleansing & before applying SPF.",
  "New Line PM Cream": "Use daily at PM on face/neck after serums.",
  "New Line Vitamin C": "Use daily at PM. Apply to face, neck, décolletage, and arms. Use alongside Red LED device for best results.",
  "Zahav Instant Sun Protector": "Use daily every AM after moisturizing face.",
  "Zahav Salicylic Cleanser": "Use as a facewash 1-2x a day. For better results, leave on for 1-2 min then wash off.",
  "Zahav Super Boost 400": "Use every AM on face and follow with moisturizer.",
  "Zahav Resurfacing Mask": "Use once per week at PM on clean and dry face. Leave on for 20 min, then rinse with water. Follow with Super Boost 400 serum or moisturizer.",
  "Zahav Enzyme Polish": "Use once a week as an exfoliator, face only.",
  "Zahav Youthful Glow": "Use every night after cleansing skin along with Red LED device for best results.",
  "Zahav Ultra Eye Boost": "Use a small amount daily AM/PM around the eyes.",
  "Zahav Ultra Day Boost": "Use daily AM/PM after serums.",
  "Zahav Vitamin C Peptide Toner": "Use daily both AM/PM or as needed after cleansing skin.",
  "Zahav Retinol Night Guard": "After cleansing, apply to face and neck at night 3x a week. Follow with moisturizer. DO NOT USE AROUND EYE.",
  "Zahav Hydra-Infusion PM Mask": "Apply in PM to face and neck after cleansing skin. Rinse after 20 mins or leave on overnight.",
  "Zahav Biotic Ultra Day Cream": "Apply to face and neck after cleansing skin in AM.",
  "Zahav Golden Glow": "Apply small drops 3x a week at night after cleansing face."
};

const PDFGenerator = ({ customerName, selectedProducts, onSuccess }) => {
  const generatePDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    const maxTextWidth = pageWidth - margin * 2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Personalized Skincare Routine", margin, 50);

    doc.setFontSize(12);
    doc.text("Provided by Zahav & New Line", margin, 70);

    // Greeting
    doc.setFontSize(14);
    doc.text(`Dear ${customerName},`, margin, 100);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Thank you for shopping with us! We appreciate your trust in our skincare products. " +
      "Below, you'll find personalized instructions to maximize the benefits of your routine.",
      margin,
      120,
      { maxWidth: maxTextWidth }
    );

    // Adjust line height dynamically
    let yPos = 160;
    const lineHeight = 18; // Increase line height to prevent overlap

    selectedProducts.forEach((product, index) => {
      if (yPos > 750) {
        doc.addPage();
        yPos = 50;
      }

      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${product}`, margin, yPos);
      yPos += lineHeight;

      doc.setFont("helvetica", "normal");

      const wrappedText = doc.splitTextToSize(productInstructions[product] || "Usage not found.", maxTextWidth);
      doc.text(wrappedText, margin, yPos);
      yPos += wrappedText.length * lineHeight; // Adjust spacing based on text length
    });

    doc.save(`${customerName}_Skincare_Routine.pdf`);
    onSuccess();
  };

  return <button onClick={generatePDF}>Download PDF</button>;
};

export default PDFGenerator;
