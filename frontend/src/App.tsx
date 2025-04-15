// App.tsx
import React, { useState, useEffect, useRef } from "react";
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

interface PackedItem {
  name: string;
  width: number;
  length: number;
  height: number;
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

// Predefined box sizes
const boxSizes = {
  S: { width: 30, length: 30, height: 30 },
  M: { width: 40, length: 40, height: 40 },
  L: { width: 50, length: 50, height: 50 },
  XL: { width: 60, length: 60, height: 60 },
};

// Colors for different supplement types
const itemColors: Record<string, string> = {
  "whey-protein": "#ff8c00",
  "pre-workout": "#ffa500",
  creatine: "#ff4500",
  multivitamin: "#ff7f50",
  thermogenic: "#ff6347",
  "whey-trial": "#ffd700",
};

// App Component
const App: React.FC = () => {
  const [supplements, setSupplements] = useState<Record<string, Dimension>>({});
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
  const [selectedBoxSize, setSelectedBoxSize] = useState<keyof typeof boxSizes>("M");
  const [packingResult, setPackingResult] = useState<PackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load example data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/example_data");
        setSupplements(response.data);
        // By default, select all supplements
        setSelectedSupplements(Object.keys(response.data));
      } catch (err) {
        setError("Failed to load example data");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Handle optimize request
  const handleOptimize = async () => {
    setLoading(true);
    setError(null);

    try {
      // Filter to only include selected supplements
      const selectedSupplementsData = Object.entries(supplements)
        .filter(([name]) => selectedSupplements.includes(name))
        .reduce((acc, [name, dimensions]) => {
          acc[name] = dimensions;
          return acc;
        }, {} as Record<string, Dimension>);

      const payload = {
        supplements: selectedSupplementsData,
        box_size: boxSizes[selectedBoxSize],
      };

      console.log("Sending payload:", payload);

      const response = await axios.post("/api/optimize", payload);
      console.log("Received response:", response.data);

      setPackingResult(response.data);
    } catch (err) {
      console.error("Error during optimization:", err);
      setError("Optimization failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Handle supplement selection toggle
  const toggleSupplement = (name: string) => {
    setSelectedSupplements((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]));
  };

  // 3D Box Component
  const Box: React.FC<{ dimensions: BoxDimensions }> = ({ dimensions }) => {
    return (
      <mesh position={[dimensions.width / 2, dimensions.length / 2, dimensions.height / 2]}>
        <boxGeometry args={[dimensions.width, dimensions.length, dimensions.height]} />
        <meshStandardMaterial wireframe color="#ffffff" />
      </mesh>
    );
  };

  // 3D Item Component
  const Item: React.FC<{ item: PackedItem; color: string }> = ({ item, color }) => {
    // Get dimensions based on rotation
    let width = item.width;
    let length = item.length;
    let height = item.height;

    // Apply rotation
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
        <meshStandardMaterial wireframe color="#222222" />
      </mesh>
    );
  };

  // Scene Component
  const Scene: React.FC<{ packingResult: PackingResult | null }> = ({ packingResult }) => {
    // Use useRef to keep a reference to the packingResult
    const resultRef = useRef(packingResult);

    // Only update the ref if packingResult is not null
    useEffect(() => {
      if (packingResult) {
        resultRef.current = packingResult;
      }
    }, [packingResult]);

    // Use the ref's current value, falling back to packingResult
    const result = resultRef.current || packingResult;

    if (!result) return null;

    return (
      <Canvas
        camera={{ position: [100, 100, 100], fov: 50 }}
        style={{ height: "500px", width: "100%" }}
        frameloop="demand"
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#1a1a1a"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableDamping={false} />

        <Box dimensions={result.box} />

        {result.packed_items.map((item, index) => (
          <Item key={`${item.name}-${index}`} item={item} color={itemColors[item.name] || "#cccccc"} />
        ))}
      </Canvas>
    );
  };

  return (
    <div className="app">
      <h1>Otimizador de Envio de Suplementos</h1>

      <div className="container">
        <div className="form-section">
          <h2>Select Products</h2>
          <div className="product-selection">
            {Object.entries(supplements).map(([name, dimensions]) => (
              <div key={name} className="product-item">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={selectedSupplements.includes(name)}
                    onChange={() => toggleSupplement(name)}
                  />
                  <span className="checkmark"></span>
                  <span className="product-name">{name}</span>
                  <span className="product-dimensions">
                    {dimensions.width}×{dimensions.length}×{dimensions.height} cm
                  </span>
                </label>
              </div>
            ))}
          </div>

          <h2>Select Box Size</h2>
          <div className="box-selection">
            {(Object.keys(boxSizes) as Array<keyof typeof boxSizes>).map((size) => (
              <button
                key={size}
                className={`box-size-button ${selectedBoxSize === size ? "selected" : ""}`}
                onClick={() => setSelectedBoxSize(size)}
              >
                {size} - {boxSizes[size].width}×{boxSizes[size].length}×{boxSizes[size].height} cm
              </button>
            ))}
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
                  Box size: {packingResult.box.width}×{packingResult.box.length}×{packingResult.box.height} cm
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
