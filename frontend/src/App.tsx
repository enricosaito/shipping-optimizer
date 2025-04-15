// App.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import "./App.css";

// Types
interface Dimension {
  width: number;
  length: number;
  height: number;
}

interface Supplement extends Dimension {
  name: string;
}

interface PackedItem extends Supplement {
  position: [number, number, number];
  rotation: number;
}

interface BoxDimensions {
  width: number;
  length: number;
  height: number;
  volume: number;
  utilization: number;
}

interface PackingResult {
  box: BoxDimensions;
  packed_items: PackedItem[];
  unpacked_items: string[];
  total_items_packed: number;
  total_items_unpacked: number;
}

// Colors for different supplement types
const itemColors: Record<string, string> = {
  "whey-protein": "#ff5733",
  "pre-workout": "#33ff57",
  creatine: "#3357ff",
  multivitamin: "#f3ff33",
  thermogenic: "#ff33f3",
  "whey-trial": "#33fff3",
};

// 3D Item Component
const Item: React.FC<{
  item: PackedItem;
  color: string;
}> = ({ item, color }) => {
  // Get dimensions based on rotation
  let width = item.width;
  let length = item.length;
  let height = item.height;

  // Apply rotation (simplified for this example)
  if (item.rotation === 1) {
    [width, height, length] = [width, length, height];
  } else if (item.rotation === 2) {
    [width, length, height] = [length, width, height];
  } else if (item.rotation === 3) {
    [width, length, height] = [length, height, width];
  } else if (item.rotation === 4) {
    [width, length, height] = [height, width, length];
  } else if (item.rotation === 5) {
    [width, length, height] = [height, length, width];
  }

  return (
    <mesh position={[item.position[0] + width / 2, item.position[1] + length / 2, item.position[2] + height / 2]}>
      <boxGeometry args={[width, length, height]} />
      <meshStandardMaterial color={color} transparent opacity={0.8} />
      <meshStandardMaterial wireframe color="#000000" />
    </mesh>
  );
};

// Box Component
const Box: React.FC<{
  dimensions: BoxDimensions;
}> = ({ dimensions }) => {
  return (
    <mesh position={[dimensions.width / 2, dimensions.length / 2, dimensions.height / 2]}>
      <boxGeometry args={[dimensions.width, dimensions.length, dimensions.height]} />
      <meshStandardMaterial wireframe color="#000000" />
    </mesh>
  );
};

// Scene Component
const Scene: React.FC<{
  packingResult: PackingResult | null;
}> = ({ packingResult }) => {
  if (!packingResult) return null;

  return (
    <Canvas camera={{ position: [100, 100, 100], fov: 50 }} style={{ height: "500px", width: "100%" }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />

      <Box dimensions={packingResult.box} />

      {packingResult.packed_items.map((item, index) => (
        <Item key={index} item={item} color={itemColors[item.name] || "#cccccc"} />
      ))}
    </Canvas>
  );
};

// Main App Component
const App: React.FC = () => {
  const [supplements, setSupplements] = useState<Record<string, Dimension>>({});
  const [customBox, setCustomBox] = useState<Dimension>({ width: 40, length: 40, height: 40 });
  const [useCustomBox, setUseCustomBox] = useState(false);
  const [packingResult, setPackingResult] = useState<PackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load example data
  useEffect(() => {
    axios
      .get("http://localhost:8000/example_data")
      .then((response) => {
        setSupplements(response.data);
      })
      .catch((err) => {
        setError("Failed to load example data");
        console.error(err);
      });
  }, []);

  // Handle optimize request
  const handleOptimize = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/optimize", {
        supplements,
        box_size: useCustomBox ? customBox : undefined,
      });

      setPackingResult(response.data);
    } catch (err) {
      setError("Optimization failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle supplement change
  const handleSupplementChange = (name: string, field: keyof Dimension, value: number) => {
    setSupplements((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [field]: value,
      },
    }));
  };

  // Handle custom box change
  const handleBoxChange = (field: keyof Dimension, value: number) => {
    setCustomBox((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="app">
      <h1>Supplement Shipping Optimizer</h1>

      <div className="container">
        <div className="form-section">
          <h2>Supplement Dimensions</h2>

          {Object.entries(supplements).map(([name, dimensions]) => (
            <div key={name} className="supplement-item">
              <h3>{name}</h3>
              <div className="dimension-inputs">
                <div>
                  <label>Width (cm)</label>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => handleSupplementChange(name, "width", parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div>
                  <label>Length (cm)</label>
                  <input
                    type="number"
                    value={dimensions.length}
                    onChange={(e) => handleSupplementChange(name, "length", parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div>
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => handleSupplementChange(name, "height", parseInt(e.target.value))}
                    min="1"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="box-settings">
            <h2>Box Settings</h2>

            <div className="checkbox-option">
              <input
                type="checkbox"
                id="useCustomBox"
                checked={useCustomBox}
                onChange={(e) => setUseCustomBox(e.target.checked)}
              />
              <label htmlFor="useCustomBox">Use custom box size</label>
            </div>

            {useCustomBox && (
              <div className="dimension-inputs">
                <div>
                  <label>Width (cm)</label>
                  <input
                    type="number"
                    value={customBox.width}
                    onChange={(e) => handleBoxChange("width", parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div>
                  <label>Length (cm)</label>
                  <input
                    type="number"
                    value={customBox.length}
                    onChange={(e) => handleBoxChange("length", parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div>
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    value={customBox.height}
                    onChange={(e) => handleBoxChange("height", parseInt(e.target.value))}
                    min="1"
                  />
                </div>
              </div>
            )}
          </div>

          <button className="optimize-button" onClick={handleOptimize} disabled={loading}>
            {loading ? "Optimizing..." : "Optimize Packing"}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="visualization-section">
          <h2>3D Visualization</h2>

          {packingResult ? (
            <>
              <div className="results-summary">
                <h3>Results</h3>
                <p>
                  Box size: {packingResult.box.width} × {packingResult.box.length} × {packingResult.box.height} cm
                </p>
                <p>Volume utilization: {packingResult.box.utilization.toFixed(2)}%</p>
                <p>Items packed: {packingResult.total_items_packed}</p>
                {packingResult.unpacked_items.length > 0 && (
                  <p>Items not packed: {packingResult.unpacked_items.join(", ")}</p>
                )}
              </div>

              <div className="canvas-container">
                <Scene packingResult={packingResult} />
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Run the optimizer to see the 3D visualization</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
