// BoxSettings.tsx
import React, { useState, useEffect } from "react";
import "./BoxSettings.css";

interface Dimension {
  width: number;
  length: number;
  height: number;
}

interface BoxSettingsProps {
  defaultBox: Dimension;
  onBoxChange: (box: Dimension | null) => void;
  onOptimize: () => void;
  loading: boolean;
  totalItems: number;
}

// Predefined shipping box sizes (in cm)
const PREDEFINED_BOXES = [
  { name: "Small", dimensions: { width: 20, length: 20, height: 20 } },
  { name: "Medium", dimensions: { width: 40, length: 40, height: 40 } },
  { name: "Large", dimensions: { width: 60, length: 60, height: 60 } },
  { name: "XL", dimensions: { width: 80, length: 80, height: 80 } },
  { name: "Custom", dimensions: { width: 30, length: 30, height: 30 } },
];

const BoxSettings: React.FC<BoxSettingsProps> = ({ defaultBox, onBoxChange, onOptimize, loading, totalItems }) => {
  const [selectedBoxType, setSelectedBoxType] = useState<string>("Optimal");
  const [customBox, setCustomBox] = useState<Dimension>(defaultBox);

  // Update box settings when selection changes
  useEffect(() => {
    if (selectedBoxType === "Optimal") {
      onBoxChange(null);
    } else {
      const predefined = PREDEFINED_BOXES.find((box) => box.name === selectedBoxType);
      if (predefined) {
        if (predefined.name === "Custom") {
          onBoxChange(customBox);
        } else {
          onBoxChange(predefined.dimensions);
        }
      }
    }
  }, [selectedBoxType, customBox, onBoxChange]);

  // Handle custom box dimension changes
  const handleDimensionChange = (field: keyof Dimension, value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) return;

    setCustomBox((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  return (
    <div className="box-settings">
      <div className="box-settings-header">
        <h3>Shipping Box Settings</h3>
      </div>

      <div className="box-options">
        <div className="box-selection">
          <div
            className={`box-option ${selectedBoxType === "Optimal" ? "selected" : ""}`}
            onClick={() => setSelectedBoxType("Optimal")}
          >
            <div className="box-icon optimal">
              <span>Auto</span>
            </div>
            <div className="box-info">
              <h4>Optimal Size</h4>
              <p>Calculate the best box size automatically</p>
            </div>
          </div>

          {PREDEFINED_BOXES.map((box) => (
            <div
              key={box.name}
              className={`box-option ${selectedBoxType === box.name ? "selected" : ""}`}
              onClick={() => setSelectedBoxType(box.name)}
            >
              <div className="box-icon">
                <span>{box.name.charAt(0)}</span>
              </div>
              <div className="box-info">
                <h4>{box.name}</h4>
                {box.name !== "Custom" && (
                  <p>
                    {box.dimensions.width} × {box.dimensions.length} × {box.dimensions.height} cm
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Custom box dimensions */}
        {selectedBoxType === "Custom" && (
          <div className="custom-dimensions">
            <h4>Custom Box Dimensions</h4>
            <div className="dimensions-inputs">
              <div className="dimension-field">
                <label>Width</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={customBox.width}
                    onChange={(e) => handleDimensionChange("width", e.target.value)}
                    min="1"
                  />
                  <span>cm</span>
                </div>
              </div>
              <div className="dimension-field">
                <label>Length</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={customBox.length}
                    onChange={(e) => handleDimensionChange("length", e.target.value)}
                    min="1"
                  />
                  <span>cm</span>
                </div>
              </div>
              <div className="dimension-field">
                <label>Height</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={customBox.height}
                    onChange={(e) => handleDimensionChange("height", e.target.value)}
                    min="1"
                  />
                  <span>cm</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="optimize-section">
          <div className="items-summary">
            <span>Total items to pack: </span>
            <span className="count">{totalItems}</span>
          </div>
          <button className="optimize-button" onClick={onOptimize} disabled={loading || totalItems === 0}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Optimizing...
              </>
            ) : (
              "Optimize Packing"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoxSettings;
