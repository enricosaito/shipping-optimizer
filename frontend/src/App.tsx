// App.tsx with enhanced 3D visualization
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
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

// Colors for different supplement types - Fill colors
const itemColors: Record<string, string> = {
  "whey-protein": "#ff8c00", // Dark Orange
  "pre-treino": "#ffa500", // Orange
  creatina: "#ff4500", // Orange Red
  multivitaminico: "#ff7f50", // Coral
  termogenico: "#ff6347", // Tomato
  "whey-sache": "#ffd700", // Gold
};

// Edge colors for different supplement types
const edgeColors: Record<string, string> = {
  "whey-protein": "#ffb347", // Lighter orange
  "pre-treino": "#ffc04d", // Lighter orange
  creatina: "#ff6e4a", // Lighter orange-red
  multivitaminico: "#ffa07a", // Lighter coral
  termogenico: "#ff8c69", // Lighter tomato
  "whey-sache": "#ffdf5e", // Lighter gold
};

// App Component
const App: React.FC = () => {
  const [supplements, setSupplements] = useState<Record<string, Dimension>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedBoxSize, setSelectedBoxSize] = useState<keyof typeof boxSizes>("M");
  const [packingResult, setPackingResult] = useState<PackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  // Load example data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/example_data");
        setSupplements(response.data);

        // Initialize quantities to 0 for each supplement
        const initialQuantities: Record<string, number> = {};
        Object.keys(response.data).forEach((name) => {
          initialQuantities[name] = 0;
        });
        setQuantities(initialQuantities);
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
      // Create expanded supplements list with duplicates based on quantities
      const expandedSupplements: Record<string, Dimension> = {};

      Object.entries(quantities).forEach(([name, quantity]) => {
        if (quantity > 0) {
          for (let i = 0; i < quantity; i++) {
            // Create unique name for each duplicate item
            const uniqueName = quantity > 1 ? `${name}-${i + 1}` : name;
            expandedSupplements[uniqueName] = supplements[name];
          }
        }
      });

      const payload = {
        supplements: expandedSupplements,
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

  // Handle quantity change
  const handleQuantityChange = (name: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [name]: Math.max(0, value), // Ensure non-negative values
    }));
  };

  // 3D Box Component
  const Box: React.FC<{ dimensions: BoxDimensions }> = ({ dimensions }) => {
    return (
      <mesh position={[dimensions.width / 2, dimensions.length / 2, dimensions.height / 2]}>
        <boxGeometry args={[dimensions.width, dimensions.length, dimensions.height]} />
        <meshStandardMaterial wireframe color="#ffffff" wireframeLinewidth={2} />
      </mesh>
    );
  };

  // Extract the base name (remove -X suffix if present)
  const getBaseName = (name: string): string => {
    const match = name.match(/^(.+?)(?:-\d+)?$/);
    return match ? match[1] : name;
  };

  // Get display name (show the number suffix if present)
  const getDisplayName = (name: string): string => {
    const match = name.match(/^(.+?)-(\d+)$/);
    return match ? `${match[1]} #${match[2]}` : name;
  };

  // 3D Item Component - Enhanced with custom wireframe effect
  const Item: React.FC<{ item: PackedItem; color: string; edgeColor: string }> = ({ item, color, edgeColor }) => {
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

    const position: [number, number, number] = [
      item.position[0] + width / 2,
      item.position[1] + length / 2,
      item.position[2] + height / 2,
    ];

    const displayName = getDisplayName(item.name);

    return (
      <group>
        {/* Main box with solid fill */}
        <mesh position={position}>
          <boxGeometry args={[width, length, height]} />
          <meshStandardMaterial color={color} transparent opacity={0.7} />
        </mesh>

        {/* Custom wireframe with colored edges */}
        <lineSegments position={position}>
          <edgesGeometry args={[new THREE.BoxGeometry(width, length, height)]} />
          <lineBasicMaterial color={edgeColor} linewidth={3} />
        </lineSegments>

        {/* Item label */}
        {showLabels && (
          <Text
            position={[position[0], position[1], position[2] + height / 2 + 1]}
            fontSize={2}
            color={edgeColor}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="#000000"
            maxWidth={width * 1.5}
          >
            {displayName}
          </Text>
        )}
      </group>
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
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[0, 100, 100]} angle={0.3} penumbra={1} intensity={0.8} castShadow />

        <OrbitControls enableDamping={false} />

        <Box dimensions={result.box} />

        {result.packed_items.map((item, index) => {
          // Get base name for color lookup
          const baseName = getBaseName(item.name);
          return (
            <Item
              key={`${item.name}-${index}`}
              item={item}
              color={itemColors[baseName] || "#cccccc"}
              edgeColor={edgeColors[baseName] || "#ffffff"}
            />
          );
        })}
      </Canvas>
    );
  };

  return (
    <div className="app">
      <h1>Otimizador de Eficiência de Envio - Silva Nutrition</h1>

      <div className="container">
        <div className="form-section">
          <h2>Selecionar Produtos</h2>
          <div className="product-selection">
            {Object.entries(supplements).map(([name, dimensions]) => (
              <div key={name} className="product-item">
                <div className="product-info">
                  <span className="product-name">{name}</span>
                  <span className="product-dimensions">
                    {dimensions.width}×{dimensions.length}×{dimensions.height} cm
                  </span>
                </div>
                <div className="quantity-control">
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(name, (quantities[name] || 0) - 1)}
                    disabled={(quantities[name] || 0) <= 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    className="quantity-input"
                    value={quantities[name] || 0}
                    onChange={(e) => handleQuantityChange(name, parseInt(e.target.value) || 0)}
                  />
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(name, (quantities[name] || 0) + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h2>Selecionar Tamanho da Caixa</h2>
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

          <div className="visualization-controls">
            <label className="toggle-container">
              <input type="checkbox" checked={showLabels} onChange={() => setShowLabels(!showLabels)} />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Mostrar Rótulos</span>
            </label>
          </div>

          <button className="optimize-button" onClick={handleOptimize} disabled={loading}>
            {loading ? "Otimizando..." : "Otimizar Empacotamento"}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="visualization-section">
          <h2>Visualização 3D</h2>

          {packingResult ? (
            <>
              <div className="results-summary">
                <h3>Resultados</h3>
                <p>
                  Tamanho da Caixa: {packingResult.box.width}×{packingResult.box.length}×{packingResult.box.height} cm
                </p>
                <p>Utilização do Volume: {packingResult.box.utilization.toFixed(2)}%</p>
                <p>Itens empacotados: {packingResult.total_items_packed}</p>
                {packingResult.unpacked_items.length > 0 && (
                  <p>Itens não empacotados: {packingResult.unpacked_items.length} items</p>
                )}
              </div>

              <div className="canvas-container">
                <Scene packingResult={packingResult} />
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Rode o otimizador para ver a visualização 3D</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
