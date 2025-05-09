import React from "react";

const BOX_P = {
  name: "Box P",
  width: 150,
  length: 140,
  height: 170,
};

export const ShippingBoxDisplay: React.FC = () => (
  <div
    style={{
      border: "2px solid #1976d2",
      borderRadius: 8,
      padding: 24,
      maxWidth: 320,
      margin: "32px auto",
      background: "#f5faff",
      boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
      textAlign: "center",
    }}
  >
    <h2 style={{ color: "#1976d2" }}>Recommended Shipping Box</h2>
    <div style={{ fontSize: 22, fontWeight: 600, margin: "16px 0" }}>{BOX_P.name}</div>
    <div style={{ fontSize: 18 }}>
      <span>
        <strong>Dimensions:</strong>
        <br />
        {BOX_P.width}mm (W) × {BOX_P.length}mm (L) × {BOX_P.height}mm (H)
      </span>
    </div>
  </div>
);

export default ShippingBoxDisplay;
