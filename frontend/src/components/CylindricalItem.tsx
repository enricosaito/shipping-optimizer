// components/CylindricalItem.tsx
import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PackedItem {
  name: string;
  width: number;
  length: number;
  height: number;
  position: [number, number, number];
  rotation: number;
}

interface CylindricalItemProps {
  item: PackedItem;
  color: string;
  isSelected: boolean;
  onSelect: () => void;
}

const CylindricalItem: React.FC<CylindricalItemProps> = ({ item, color, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const highlightRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // For cylinders, we'll use the minimum of width and length as the diameter
  const radius = Math.min(item.width, item.length) / 2;

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

  // Animate highlight effect
  useFrame((state) => {
    if (highlightRef.current && isSelected) {
      highlightRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + height + 0.2;
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[
          item.position[0] + radius,
          item.position[2] + height / 2, // Z position is used for height in Three.js
          item.position[1] + radius, // Y position in data is Z in Three.js
        ]}
        onClick={onSelect}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <cylinderGeometry args={[radius, radius, height, 32]} />
        <meshStandardMaterial
          color={color}
          transparent={true}
          opacity={hovered || isSelected ? 1 : 0.8}
          emissive={hovered || isSelected ? color : undefined}
          emissiveIntensity={hovered ? 0.2 : isSelected ? 0.4 : 0}
        />
      </mesh>

      {/* Selection highlight */}
      {isSelected && (
        <mesh
          ref={highlightRef}
          position={[item.position[0] + radius, item.position[2] + height + 0.5, item.position[1] + radius]}
        >
          <sphereGeometry args={[radius * 0.25, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      )}

      {/* Item label */}
      {(hovered || isSelected) && (
        <group position={[item.position[0] + radius, item.position[2] + height + 1, item.position[1] + radius]}>
          <mesh>
            <boxGeometry args={[radius * 2 + 2, 1, 0.1]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <textGeometry args={[item.name, { size: 0.5, height: 0.1 }]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default CylindricalItem;
