import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Any

class Item:
    """Represents a 3D item to be packed"""
    def __init__(self, name: str, width: int, length: int, height: int):
        self.name = name
        self.width = width
        self.length = length
        self.height = height
        self.volume = width * length * height
        self.position = None  # (x, y, z) coordinates when placed
        self.rotation = None  # How the item is rotated in the bin
        
    def get_dimensions(self, rotation: int = 0) -> Tuple[int, int, int]:
        """Get dimensions based on rotation (0-5 for 6 possible orientations)"""
        w, l, h = self.width, self.length, self.height
        rotations = [
            (w, l, h),  # original
            (w, h, l),  # rotate around x
            (l, w, h),  # rotate around y
            (l, h, w),  # rotate around y then x
            (h, w, l),  # rotate around z then x
            (h, l, w),  # rotate around z
        ]
        return rotations[rotation % 6]
    
    def __repr__(self):
        position_str = f" @ {self.position}" if self.position else ""
        rotation_str = f" (rotated: {self.rotation})" if self.rotation is not None else ""
        return f"{self.name} [{self.width}×{self.length}×{self.height}]{position_str}{rotation_str}"


class Box:
    """Represents a 3D box to pack items into"""
    def __init__(self, width: int, length: int, height: int):
        self.width = width
        self.length = length
        self.height = height
        self.volume = width * length * height
        self.items = []
        # 3D grid to track occupied space (1 = occupied, 0 = free)
        self.space = np.zeros((width, length, height), dtype=np.int8)
        
    def is_valid_position(self, item: Item, x: int, y: int, z: int, rotation: int) -> bool:
        """Check if item can be placed at position with given rotation"""
        w, l, h = item.get_dimensions(rotation)
        
        # Check if item would fit within box boundaries
        if x + w > self.width or y + l > self.length or z + h > self.height:
            return False
        
        # Check if space is already occupied
        if np.any(self.space[x:x+w, y:y+l, z:z+h] != 0):
            return False
            
        return True
        
    def place_item(self, item: Item, x: int, y: int, z: int, rotation: int) -> bool:
        """Place item at position with given rotation"""
        if not self.is_valid_position(item, x, y, z, rotation):
            return False
            
        w, l, h = item.get_dimensions(rotation)
        
        # Update space grid
        self.space[x:x+w, y:y+l, z:z+h] = 1
        
        # Update item properties
        item.position = (x, y, z)
        item.rotation = rotation
        
        # Add to items list
        self.items.append(item)
        
        return True
    
    def get_volume_utilization(self) -> float:
        """Calculate volume utilization percentage"""
        if not self.items:
            return 0.0
            
        used_volume = sum(item.volume for item in self.items)
        return (used_volume / self.volume) * 100
    
    def __repr__(self):
        return f"Box [{self.width}×{self.length}×{self.height}] with {len(self.items)} items, {self.get_volume_utilization():.2f}% full"


def pack_items_into_box(items: List[Item], box: Box) -> Box:
    """Pack items into box using bottom-left-back heuristic with rotations"""
    # Sort items by volume (largest first)
    items_sorted = sorted(items, key=lambda x: x.volume, reverse=True)
    
    # Try to place each item
    for item in items_sorted:
        placed = False
        
        # Try all possible rotations
        for rotation in range(6):
            if placed:
                break
                
            w, l, h = item.get_dimensions(rotation)
            
            # Try all possible positions using bottom-left-back first strategy
            for x in range(box.width - w + 1):
                for y in range(box.length - l + 1):
                    for z in range(box.height - h + 1):
                        if box.place_item(item, x, y, z, rotation):
                            placed = True
                            break
                    if placed:
                        break
                if placed:
                    break
    
    return box


def find_optimal_box(items: List[Item], max_iterations: int = 10) -> Tuple[Box, List[Item]]:
    """Find optimal box size through iterative refinement"""
    # Calculate minimum required volume
    total_volume = sum(item.volume for item in items)
    
    # Start with a cube that would perfectly fit all items volumetrically
    side_length = int(np.ceil(total_volume ** (1/3)))
    
    # Find largest single dimension to ensure minimum box size
    max_dimension = max(
        max(item.width, item.length, item.height) for item in items
    )
    
    # Initial box size
    box_width = max(side_length, max_dimension)
    box_length = max(side_length, max_dimension)
    box_height = max(side_length, max_dimension)
    
    best_box = Box(box_width, box_length, box_height)
    best_box = pack_items_into_box(items, best_box)
    packed_items = [item for item in best_box.items]
    unpacked_items = [item for item in items if item not in packed_items]
    
    # If all items packed on first try, try to reduce box size
    if not unpacked_items:
        for _ in range(max_iterations):
            # Try reducing one dimension at a time
            reductions = [
                (box_width - 1, box_length, box_height),
                (box_width, box_length - 1, box_height),
                (box_width, box_length, box_height - 1)
            ]
            
            improved = False
            for new_w, new_l, new_h in reductions:
                # Skip if any dimension would become smaller than max item dimension
                if new_w < max_dimension or new_l < max_dimension or new_h < max_dimension:
                    continue
                    
                test_box = Box(new_w, new_l, new_h)
                test_box = pack_items_into_box(items, test_box)
                test_packed = [item for item in test_box.items]
                test_unpacked = [item for item in items if item not in test_packed]
                
                if not test_unpacked:
                    best_box = test_box
                    box_width, box_length, box_height = new_w, new_l, new_h
                    improved = True
                    break
            
            if not improved:
                break
    
    # Recalculate packed and unpacked items
    packed_items = [item for item in best_box.items]
    unpacked_items = [item for item in items if item not in packed_items]
    
    return best_box, unpacked_items


def pack_supplements(supplements_data: Dict[str, Dict[str, int]], box_size: Tuple[int, int, int] = None) -> Dict[str, Any]:
    """Main function to pack supplements into boxes"""
    # Convert supplements data to Item objects
    items = []
    for name, dimensions in supplements_data.items():
        items.append(Item(
            name=name,
            width=dimensions['width'],
            length=dimensions['length'],
            height=dimensions['height']
        ))
    
    if box_size:
        # Use provided box size
        box = Box(box_size[0], box_size[1], box_size[2])
        box = pack_items_into_box(items, box)
        packed_items = [item for item in box.items]
        unpacked_items = [item for item in items if item not in packed_items]
    else:
        # Find optimal box size
        box, unpacked_items = find_optimal_box(items)
    
    # Prepare results
    result = {
        'box': {
            'width': box.width,
            'length': box.length,
            'height': box.height,
            'volume': box.volume,
            'utilization': box.get_volume_utilization()
        },
        'packed_items': [
            {
                'name': item.name,
                'width': item.width,
                'length': item.length,
                'height': item.height,
                'position': item.position,
                'rotation': item.rotation
            }
            for item in box.items
        ],
        'unpacked_items': [item.name for item in unpacked_items],
        'total_items_packed': len(box.items),
        'total_items_unpacked': len(unpacked_items)
    }
    
    return result


# Example usage
if __name__ == "__main__":
    supplements = {
        "whey-protein": {
            "width": 16,
            "length": 16,
            "height": 26
        },
        "pre-treino": {
            "width": 12,
            "length": 12,
            "height": 12
        },
        "creatina": {
            "width": 12,
            "length": 12,
            "height": 12
        },
        "multivitaminico": {
            "width": 7,
            "length": 7,
            "height": 14
        },
        "termogenico": {
            "width": 7,
            "length": 7,
            "height": 12
        },
        "whey-sache": {
            "width": 2,
            "length": 11,
            "height": 16
        }
    }
    
    # Find optimal box size
    result = pack_supplements(supplements)
    print(f"Optimal box size: {result['box']['width']}×{result['box']['length']}×{result['box']['height']} cm")
    print(f"Volume utilization: {result['box']['utilization']:.2f}%")
    print(f"Items packed: {result['total_items_packed']}")
    
    # Use specific box size (40×40×40 cm)
    result = pack_supplements(supplements, box_size=(40, 40, 40))
    print(f"\nPredefined box size: 40×40×40 cm")
    print(f"Volume utilization: {result['box']['utilization']:.2f}%")
    print(f"Items packed: {result['total_items_packed']}")
    print(f"Items not packed: {result['unpacked_items']}")