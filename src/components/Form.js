import React, { useState } from "react";
import PDFGenerator from "./PDFGenerator";

const zahavProducts = [
  "Zahav Instant Sun Protector",
  "Zahav Salicylic Cleanser",
  "Zahav Super Boost 400",
  "Zahav Resurfacing Mask",
  "Zahav Enzyme Polish",
  "Zahav Youthful Glow",
  "Zahav Ultra Eye Boost",
  "Zahav Ultra Day Boost",
  "Zahav Vitamin C Peptide Toner",
  "Zahav Retinol Night Guard",
  "Zahav Hydra-Infusion PM Mask",
  "Zahav Biotic Ultra Day Cream",
  "Zahav Golden Glow"
];

const newLineProducts = [
  "New Line Cleanser",
  "New Line Facial Peel",
  "New Line Day Cream",
  "New Line PM Cream",
  "New Line Vitamin C"
];

const Form = () => {
  const [customerName, setCustomerName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleProductChange = (event) => {
    const value = event.target.value;
    setSelectedProducts((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const handleFormReset = () => {
    setCustomerName("");
    setSelectedProducts([]);
    setSuccessMessage(true);

    // Hide the message after 3 seconds
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <div className="form-container">
      <h2>Enter Customer Details</h2>
      <label>First Name:</label>
      <input
        type="text"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        placeholder="Enter first name"
      />

      <h2>Select Products</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Zahav Products</th>
            <th>New Line Products</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.max(zahavProducts.length, newLineProducts.length) }).map(
            (_, index) => (
              <tr key={index}>
                <td>
                  {zahavProducts[index] && (
                    <label>
                      <input
                        type="checkbox"
                        value={zahavProducts[index]}
                        checked={selectedProducts.includes(zahavProducts[index])}
                        onChange={handleProductChange}
                      />
                      {zahavProducts[index]}
                    </label>
                  )}
                </td>
                <td>
                  {newLineProducts[index] && (
                    <label>
                      <input
                        type="checkbox"
                        value={newLineProducts[index]}
                        checked={selectedProducts.includes(newLineProducts[index])}
                        onChange={handleProductChange}
                      />
                      {newLineProducts[index]}
                    </label>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {selectedProducts.length > 0 && customerName && (
        <PDFGenerator
          customerName={customerName}
          selectedProducts={selectedProducts}
          onSuccess={handleFormReset}
        />
      )}

      {successMessage && <p className="success-message">✅ File has been successfully created!</p>}
    </div>
  );
};

export default Form;
