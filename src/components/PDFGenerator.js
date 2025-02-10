import React from "react";
import jsPDF from "jspdf";
import emailjs from "emailjs-com";

const productInstructions = {
  "New Line Cleanser": "Use daily in AM / PM.",
  "New Line Facial Peel": "Apply a thin layer all over the face. Avoid the eye area. Leave on for 1 min then massage in circle motions all over the face and rinse with warm water. Repeat 1x a week.",
  "New Line Day Cream": "Use daily every AM after cleansing & before applying SPF.",
  "New Line PM Cream": "Use daily at PM on face/neck after serums.",
  "New Line Vitamin C": "Use daily at PM. Apply to face, neck, décolletage, and arms. Use alongside Red LED device for best results.",
  "Zahav Instant Sun Protector": "Use daily every AM after moisturizing face.",
  "Zahav Salicylic Cleanser": "Use as a facewash 1-2x a day. For better results, leave on for 1-2 min then wash off.",
  "Zahav Super Boost 400": "Use every AM on face and follow with moisturizer.",
  "Zahav Resurfacing Mask": "Use once per week at PM on clean and dry face. Leave on for 20 min, then rinse with water. Follow with Super Boost 400 serum or moisturizer."
};

const PDFGenerator = ({ customerName, customerEmail, selectedProducts, onSuccess }) => {
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

    doc.setFontSize(14);
    doc.text(`Dear ${customerName},`, margin, 100);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Thank you for shopping with us! Below are your personalized skincare instructions.",
      margin,
      120,
      { maxWidth: maxTextWidth }
    );

    let yPos = 160;
    selectedProducts.forEach((product, index) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${product}`, margin, yPos);
      yPos += 18;

      doc.setFont("helvetica", "normal");
      const wrappedText = doc.splitTextToSize(productInstructions[product] || "Usage not found.", maxTextWidth);
      doc.text(wrappedText, margin, yPos);
      yPos += wrappedText.length * 18;
    });

    const pdfFileName = `${customerName}_Skincare_Routine.pdf`;
    const pdfBase64 = doc.output("datauristring").split(",")[1];

    sendEmail(pdfBase64, pdfFileName);
    onSuccess();
  };

  const sendEmail = (pdfBase64, pdfFileName) => {
    const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const userID = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    const emailParams = {
      name: customerName,
      email: customerEmail,
      attachment: pdfBase64,
      attachment_filename: pdfFileName
    };

    emailjs.send(serviceID, templateID, emailParams, userID)
      .then(() => alert("Email has been sent successfully!"))
      .catch(() => alert("Failed to send email. Please try again."));
  };

  return <button onClick={generatePDF}>Generate & Send PDF</button>;
};

export default PDFGenerator;
