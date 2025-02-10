import React, { useState } from "react";

const Form = () => {
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Product:", selectedProduct);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <label>Select a Product:</label>
      <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
        <option value="">-- Select --</option>
        <option value="Product A">Product A</option>
        <option value="Product B">Product B</option>
      </select>
      <button type="submit">Generate PDF</button>
    </form>
  );
};

export default Form;
