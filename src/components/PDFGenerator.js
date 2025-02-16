import React from "react";
import jsPDF from "jspdf";
import emailjs from "emailjs-com";
import phoneIcon from "../assets/icons/phone.png";
import globeIcon from "../assets/icons/globe.png";
import locationIcon from "../assets/icons/location.png";
import instagramIcon from "../assets/icons/instagram.png";
import montserratBase64 from "../assets/fonts/MontserratBase64";
import montserratBoldBase64 from "../assets/fonts/MontserratBoldBase64";


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

const PDFGenerator = ({ customerName, customerEmail, selectedProducts, onSuccess }) => {
  const createPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    
    // Register Montserrat Font
    doc.addFileToVFS("Montserrat-Regular.ttf", montserratBase64);
    doc.addFont("Montserrat-Regular.ttf", "montserrat", "normal");
    doc.addFileToVFS("Montserrat-Bold.ttf", montserratBoldBase64);
    doc.addFont("Montserrat-Bold.ttf", "montserrat", "bold");

    let yPos = 80; // Start with a top margin of 40px

    // Header
    doc.setFont("montserrat", "normal"); 
    doc.setFontSize(25);
    doc.text("THANK YOU, FROM ZAHAV MEDSPA", margin, yPos);
    yPos += 50; // Space after the header

    // First Paragraph (No Change)
    doc.setFontSize(12);
    doc.setFont("montserrat", "normal");
    doc.text(`Dear ${customerName},`, margin, yPos);
    yPos += 25;

    const firstParagraph = `Thank you for your recent visit at Zahav Med Spa. We are happy to have you as a valued customer. 
    We hope you enjoyed your treatment with us and we’re looking forward to having you again for one of our luxury treatments. 
    Per your customization of the treatment with one of our beauty representatives, please follow the following instructions:`;

    const wrappedFirstParagraph = doc.splitTextToSize(firstParagraph, pageWidth - margin * 2);
    doc.text(wrappedFirstParagraph, margin, yPos);
    yPos += wrappedFirstParagraph.length * 18 + 10; // Add 10px margin after the first paragraph

    // Second Paragraph (No Change)
    doc.setFont("montserrat", "normal");

    // Instructions
    selectedProducts.forEach((product, index) => {
        doc.setFont("montserrat", "bold");
        doc.text(`${index + 1}. ${product}`, margin, yPos);
        yPos += 18;

        doc.setFont("montserrat", "normal");
        const wrappedText = doc.splitTextToSize(productInstructions[product] || "Usage instructions not found.", pageWidth - margin * 2);
        doc.text(wrappedText, margin, yPos);
        yPos += wrappedText.length * 18;
    });

    // Ensure Footer Stays at the Bottom
    const footerHeight = 100; // Footer Height (Fixed)
    yPos = Math.max(yPos, pageHeight - footerHeight);

    // Footer - Stay in Touch
    doc.setFont("montserrat", "bold");
    doc.setFontSize(14);
    doc.text("Stay in Touch", margin, yPos);
    yPos += 20;

    doc.setFont("montserrat", "normal");
    doc.setFontSize(12);

    // Icon size and spacing
    const iconSize = 14;
    const textIndent = 30; // Space after icons

    const addIconText = (icon, text, url = null) => {
        doc.addImage(icon, "PNG", margin, yPos - 12, iconSize, iconSize);
        if (url) {
            doc.textWithLink(text, margin + textIndent, yPos, { url });
        } else {
            doc.text(text, margin + textIndent, yPos);
        }
        yPos += 20;
    };

    addIconText(phoneIcon, "480-319-5765 (We accept SMS)", "tel:4803195765");
    addIconText(globeIcon, "www.zahavmedspa.com", "https://www.zahavmedspa.com");
    addIconText(locationIcon, "8700 E Pinnacle Peak Rd. Suite 101, Scottsdale AZ", "https://goo.gl/maps/QfXq7x6ZK8v3yPuq5");
    addIconText(instagramIcon, "Instagram: @medspazahav", "https://www.instagram.com/medspazahav");

    return doc;
};

  const downloadPDF = () => {
    const doc = createPDF();
    doc.save(`${customerName}_Skincare_Routine.pdf`);
  };

  const sendEmail = () => {
    const doc = createPDF();
    const pdfFileName = `${customerName}_Skincare_Routine.pdf`;
    const pdfBase64 = doc.output("datauristring").split(",")[1]; // Convert to Base64

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
    
    onSuccess();
  };

  return (
    <div>
      <button onClick={downloadPDF}>Download PDF</button>
      <button onClick={sendEmail}>Send Email with PDF</button>
    </div>
  );
};

export default PDFGenerator;
