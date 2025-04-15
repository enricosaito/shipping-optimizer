import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

// Sample data structure for visualization
const sampleData = {
  box: {
    width: 40,
    length: 40,
    height: 40,
  },
  items: [
    { name: "Whey Protein", position: [2, 2, 0], radius: 8, height: 26, color: "#ff5733" },
    { name: "Creatine", position: [20, 20, 0], radius: 6, height: 12, color: "#3357ff" },
    { name: "Pre-Workout", position: [2, 20, 0], radius: 6, height: 12, color: "#33ff57" },
    { name: "Multivitamin", position: [20, 2, 0], radius: 3.5, height: 14, color: "#f3ff33" },
    { name: "Thermogenic", position: [10, 10, 12], radius: 3.5, height: 12, color: "#ff33f3" },
  ],
};

// Cylinder component representing a supplement container
const SupplementContainer = ({ position, radius, height, color, name, selected, onSelect }) => {
  const meshRef = useRef();

  return (
    <mesh
      position={[position[0] + radius, position[1] + radius, position[2] + height / 2]}
      ref={meshRef}
      onClick={() => onSelect(name)}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <cylinderGeometry args={[radius, radius, height, 32]} />
      <meshStandardMaterial
        color={color}
        transparent={true}
        opacity={selected ? 1 : 0.8}
        emissive={selected ? color : undefined}
        emissiveIntensity={selected ? 0.3 : 0}
      />
      {selected && (
        <mesh position={[0, 0, height / 2 + 0.5]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      )}
    </mesh>
  );
};

// Shipping box component
const ShippingBox = ({ width, length, height }) => {
  return (
    <mesh position={[width / 2, length / 2, height / 2]}>
      <boxGeometry args={[width, length, height]} />
      <meshStandardMaterial color="#aaaaaa" transparent={true} opacity={0.1} />
      <meshStandardMaterial wireframe={true} color="#000000" />
    </mesh>
  );
};

// Grid component for the box floor
const GridFloor = ({ width, length }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[width / 2, length / 2, 0]}>
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial color="#f0f0f0" wireframe={true} transparent={true} opacity={0.3} />
    </mesh>
  );
};

// Info panel that appears when a supplement is selected
const InfoPanel = ({ item }) => {
  if (!item) return null;

  return (
    <div className="info-panel">
      <h3>{item.name}</h3>
      <div className="info-content">
        <div className="info-row">
          <span>Diameter:</span>
          <span>{item.radius * 2} cm</span>
        </div>
        <div className="info-row">
          <span>Height:</span>
          <span>{item.height} cm</span>
        </div>
        <div className="info-row">
          <span>Position:</span>
          <span>
            X: {item.position[0]}, Y: {item.position[1]}, Z: {item.position[2]}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main visualization component
const PackingVisualization = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const { box, items } = sampleData;

  const handleSelect = (name) => {
    const item = items.find((i) => i.name === name);
    setSelectedItem(selectedItem?.name === name ? null : item);
  };

  return (
    <div className="visualization-container">
      <Canvas className="canvas">
        <ambientLight intensity={0.5} />
        <pointLight position={[100, 100, 100]} intensity={1} />
        <directionalLight position={[-50, 50, 50]} intensity={0.8} />

        <ShippingBox width={box.width} length={box.length} height={box.height} />
        <GridFloor width={box.width} length={box.length} />

        {items.map((item, index) => (
          <SupplementContainer
            key={index}
            position={item.position}
            radius={item.radius}
            height={item.height}
            color={item.color}
            name={item.name}
            selected={selectedItem?.name === item.name}
            onSelect={handleSelect}
          />
        ))}

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={10} maxDistance={200} />
        <PerspectiveCamera makeDefault position={[80, 80, 80]} fov={40} />
      </Canvas>

      {selectedItem && <InfoPanel item={selectedItem} />}

      <div className="controls-help">
        <p>Drag to rotate • Scroll to zoom • Shift+drag to pan</p>
        <p>Click on a container to see details</p>
      </div>
    </div>
  );
};

export default PackingVisualization;
