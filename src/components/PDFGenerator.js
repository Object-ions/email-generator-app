import React from "react";
import jsPDF from "jspdf";
import emailjs from "emailjs-com";
import phoneIcon from "../assets/icons/phone.png";
import globeIcon from "../assets/icons/globe.png";
import locationIcon from "../assets/icons/location.png";
import instagramIcon from "../assets/icons/instagram.png";
import modelImage from "../assets/images/model.jpg";

const PDFGenerator = ({ customerName, customerEmail, selectedProducts, onSuccess }) => {
  const createPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    const columnWidth = (pageWidth - margin * 2) / 2; // Divide page into two columns

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
      { maxWidth: pageWidth - margin * 2 }
    );

    let yPos = 160;
    selectedProducts.forEach((product, index) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${product}`, margin, yPos);
      yPos += 18;

      doc.setFont("helvetica", "normal");
      const wrappedText = doc.splitTextToSize(product, pageWidth - margin * 2);
      doc.text(wrappedText, margin, yPos);
      yPos += wrappedText.length * 18;
    });

    // Add spacing before Stay in Touch section
    yPos += 40;
    const sectionTop = yPos; // Save this position to align the model image

    // Left Column: Stay in Touch
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Stay in Touch", margin, yPos);
    yPos += 20;

    doc.setFont("helvetica", "normal");
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

    // Right Column: Model Image
    const imgWidth = columnWidth; // Ensure the image fits inside the second column
    const imgHeight = imgWidth * 1.3; // Adjust aspect ratio

    doc.addImage(modelImage, "JPEG", margin + columnWidth + 20, sectionTop, imgWidth, imgHeight);

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
