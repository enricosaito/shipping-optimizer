// PackingResults.tsx
import React, { useState } from "react";
import "./PackingResults.css";

interface BoxDimensions {
  width: number;
  length: number;
  height: number;
  volume: number;
  utilization: number;
}

interface PackedItem {
  name: string;
  width: number;
  length: number;
  height: number;
  position: [number, number, number];
  rotation: number;
}

interface PackingResult {
  box: BoxDimensions;
  packed_items: PackedItem[];
  unpacked_items: string[];
  total_items_packed: number;
  total_items_unpacked: number;
}

interface PackingResultsProps {
  result: PackingResult | null;
  loading: boolean;
}

const PackingResults: React.FC<PackingResultsProps> = ({ result, loading }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "items">("overview");

  if (loading) {
    return (
      <div className="packing-results loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Optimizing packing arrangement...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="packing-results empty">
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Results Yet</h3>
          <p>Add products and run the optimizer to see packing results</p>
        </div>
      </div>
    );
  }

  // Calculate additional stats
  const boxVolume = result.box.volume;
  const usedVolume = boxVolume * (result.box.utilization / 100);
  const wastedVolume = boxVolume - usedVolume;

  return (
    <div className="packing-results">
      <div className="results-header">
        <h3>Packing Results</h3>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button className={`tab ${activeTab === "items" ? "active" : ""}`} onClick={() => setActiveTab("items")}>
            Items List
          </button>
        </div>
      </div>

      <div className="results-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">
                  {result.box.width} × {result.box.length} × {result.box.height}
                </div>
                <div className="stat-label">Box Size (cm)</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{result.box.utilization.toFixed(2)}%</div>
                <div className="stat-label">Volume Utilization</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{result.total_items_packed}</div>
                <div className="stat-label">Items Packed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{result.box.volume.toLocaleString()} cm³</div>
                <div className="stat-label">Box Volume</div>
              </div>
            </div>

            {result.total_items_unpacked > 0 && (
              <div className="unpacked-warning">
                <h4>⚠️ Some items couldn't be packed</h4>
                <p>The following items couldn't fit in the box:</p>
                <ul>
                  {result.unpacked_items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p>Try using a larger box or reducing the number of items.</p>
              </div>
            )}

            <div className="volume-visualization">
              <h4>Volume Utilization</h4>
              <div className="volume-bar">
                <div
                  className="used-volume"
                  style={{ width: `${result.box.utilization}%` }}
                  title={`${usedVolume.toLocaleString()} cm³ used`}
                ></div>
                <div
                  className="wasted-volume"
                  style={{ width: `${100 - result.box.utilization}%` }}
                  title={`${wastedVolume.toLocaleString()} cm³ wasted`}
                ></div>
              </div>
              <div className="volume-legend">
                <div className="legend-item">
                  <div className="color-box used"></div>
                  <span>
                    Used: {usedVolume.toLocaleString()} cm³ ({result.box.utilization.toFixed(2)}%)
                  </span>
                </div>
                <div className="legend-item">
                  <div className="color-box wasted"></div>
                  <span>
                    Empty: {wastedVolume.toLocaleString()} cm³ ({(100 - result.box.utilization).toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "items" && (
          <div className="items-tab">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Dimensions (cm)</th>
                  <th>Position (x,y,z)</th>
                  <th>Rotation</th>
                </tr>
              </thead>
              <tbody>
                {result.packed_items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>
                      {item.width} × {item.length} × {item.height}
                    </td>
                    <td>{item.position.join(", ")}</td>
                    <td>{item.rotation}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {result.unpacked_items.length > 0 && (
              <div className="unpacked-section">
                <h4>Unpacked Items</h4>
                <ul className="unpacked-list">
                  {result.unpacked_items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackingResults;
