// components/ShippingBox.tsx
import React from "react";
import * as THREE from "three";

interface BoxDimensions {
  width: number;
  length: number;
  height: number;
  volume?: number;
  utilization?: number;
}

interface ShippingBoxProps {
  dimensions: BoxDimensions;
}

const ShippingBox: React.FC<ShippingBoxProps> = ({ dimensions }) => {
  // Create box edges instead of a solid box
  const edges = [
    // Bottom edges
    [
      [0, 0, 0],
      [dimensions.width, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, dimensions.length],
    ],
    [
      [dimensions.width, 0, 0],
      [dimensions.width, 0, dimensions.length],
    ],
    [
      [0, 0, dimensions.length],
      [dimensions.width, 0, dimensions.length],
    ],

    // Top edges
    [
      [0, dimensions.height, 0],
      [dimensions.width, dimensions.height, 0],
    ],
    [
      [0, dimensions.height, 0],
      [0, dimensions.height, dimensions.length],
    ],
    [
      [dimensions.width, dimensions.height, 0],
      [dimensions.width, dimensions.height, dimensions.length],
    ],
    [
      [0, dimensions.height, dimensions.length],
      [dimensions.width, dimensions.height, dimensions.length],
    ],

    // Vertical edges
    [
      [0, 0, 0],
      [0, dimensions.height, 0],
    ],
    [
      [dimensions.width, 0, 0],
      [dimensions.width, dimensions.height, 0],
    ],
    [
      [0, 0, dimensions.length],
      [0, dimensions.height, dimensions.length],
    ],
    [
      [dimensions.width, 0, dimensions.length],
      [dimensions.width, dimensions.height, dimensions.length],
    ],
  ];

  return (
    <group>
      {/* Transparent box */}
      <mesh position={[dimensions.width / 2, dimensions.height / 2, dimensions.length / 2]}>
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.length]} />
        <meshStandardMaterial color="#aaaaaa" transparent opacity={0.05} />
      </mesh>

      {/* Box edges */}
      {edges.map((edge, index) => {
        const start = new THREE.Vector3(edge[0][0], edge[0][1], edge[0][2]);
        const end = new THREE.Vector3(edge[1][0], edge[1][1], edge[1][2]);

        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        direction.normalize();

        // Calculate rotation
        const quaternion = new THREE.Quaternion();
        if (Math.abs(direction.y) === 1) {
          // Vertical edge
          quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
        } else {
          // Horizontal edge
          quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction);
        }

        const position = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

        return (
          <mesh key={index} position={[position.x, position.y, position.z]} quaternion={quaternion}>
            <cylinderGeometry args={[0.1, 0.1, length, 8]} />
            <meshStandardMaterial color="#444444" />
          </mesh>
        );
      })}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[dimensions.width / 2, 0, dimensions.length / 2]}>
        <planeGeometry args={[dimensions.width, dimensions.length]} />
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export default ShippingBox;
