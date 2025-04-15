// App.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ProductManager from "./components/ProductManager";
import BoxSettings from "./components/BoxSettings";
import PackingResults from "./components/PackingResults";
import "./App.css";

// Import visualization components
import CylindricalItem from "./components/Cylindricalitem";
import ShippingBox from "./components/ShippingBox";

// Types
interface Dimension {
  width: number;
  length: number;
  height: number;
}

interface Product {
  name: string;
  dimensions: Dimension;
  color: string;
  quantity: number;
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

// Default products
const DEFAULT_PRODUCTS: Product[] = [
  { name: "Whey Protein", dimensions: { width: 16, length: 16, height: 26 }, color: "#ff5733", quantity: 1 },
  { name: "Pre-Workout", dimensions: { width: 12, length: 12, height: 12 }, color: "#33ff57", quantity: 1 },
  { name: "Creatine", dimensions: { width: 12, length: 12, height: 12 }, color: "#3357ff", quantity: 1 },
  { name: "Multivitamin", dimensions: { width: 7, length: 7, height: 14 }, color: "#f3ff33", quantity: 1 },
  { name: "Thermogenic", dimensions: { width: 7, length: 7, height: 12 }, color: "#ff33f3", quantity: 1 },
  { name: "Whey Trial", dimensions: { width: 2, length: 11, height: 16 }, color: "#33fff3", quantity: 1 },
];

// 3D Visualization Component
const Visualization: React.FC<{
  packingResult: PackingResult | null;
}> = ({ packingResult }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  if (!packingResult) return null;

  return (
    <div className="visualization-container">
      <Canvas camera={{ position: [100, 100, 100], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[100, 100, 100]} intensity={1} />
        <directionalLight position={[-50, 50, 50]} intensity={0.8} />

        <ShippingBox dimensions={packingResult.box} />

        {packingResult.packed_items.map((item, index) => (
          <CylindricalItem
            key={index}
            item={item}
            color={getColorForItem(item.name)}
            isSelected={selectedItem === item.name}
            onSelect={() => setSelectedItem(selectedItem === item.name ? null : item.name)}
          />
        ))}

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <gridHelper
          args={[200, 20, "#bbbbbb", "#eeeeee"]}
          position={[packingResult.box.width / 2, 0, packingResult.box.length / 2]}
        />
      </Canvas>

      <div className="visualization-controls">
        <p>Drag to rotate • Scroll to zoom • Shift+drag to pan</p>
      </div>
    </div>
  );
};

// Helper function to get color for an item
const getColorForItem = (name: string): string => {
  const productName = name.split("-")[0]; // Handle numbered suffixes
  const product = DEFAULT_PRODUCTS.find((p) => p.name === productName);
  return product?.color || "#cccccc";
};

// Main App Component
const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [customBox, setCustomBox] = useState<Dimension | null>(null);
  const [packingResult, setPackingResult] = useState<PackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle product changes
  const handleProductsChange = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    // Reset results when products change
    setPackingResult(null);
  };

  // Handle box changes
  const handleBoxChange = (box: Dimension | null) => {
    setCustomBox(box);
    // Reset results when box changes
    setPackingResult(null);
  };

  // Calculate total items
  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);

  // Handle optimize request
  const handleOptimize = async () => {
    if (totalItems === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Build the supplements data based on quantities
      const supplements: Record<string, Dimension> = {};

      products.forEach((product) => {
        for (let i = 0; i < product.quantity; i++) {
          // Add numbered suffix for multiple items of the same type
          const itemName = product.quantity > 1 ? `${product.name}-${i + 1}` : product.name;
          supplements[itemName] = product.dimensions;
        }
      });

      const response = await axios.post("http://localhost:8000/optimize", {
        supplements,
        box_size: customBox,
      });

      setPackingResult(response.data);
    } catch (err) {
      setError("Optimization failed. Please check your server connection and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Supplement Shipping Optimizer</h1>
        <p>Efficiently pack your cylindrical supplement products for shipping</p>
      </header>

      <div className="app-container">
        <div className="configuration-panel">
          <ProductManager initialProducts={products} onProductsChange={handleProductsChange} />

          <BoxSettings
            defaultBox={{ width: 40, length: 40, height: 40 }}
            onBoxChange={handleBoxChange}
            onOptimize={handleOptimize}
            loading={loading}
            totalItems={totalItems}
          />

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="results-panel">
          <div className="visualization-section">
            <h2>3D Visualization</h2>
            {loading && (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Optimizing packing arrangement...</p>
              </div>
            )}

            {!loading && packingResult && <Visualization packingResult={packingResult} />}

            {!loading && !packingResult && (
              <div className="empty-visualization">
                <div className="empty-icon">📦</div>
                <p>Run the optimizer to see the 3D visualization</p>
              </div>
            )}
          </div>

          <PackingResults result={packingResult} loading={loading} />
        </div>
      </div>

      <footer className="app-footer">
        <p>&copy; 2025 Supplement Shipping Optimizer</p>
      </footer>
    </div>
  );
};

export default App;
