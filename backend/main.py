from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Tuple, Optional, Any
import pandas as pd
import json

# Import our bin packing algorithm
from bin_packing_algorithm import pack_supplements, Item, Box

app = FastAPI(title="Supplement Shipping Optimizer")

# Add CORS middleware to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input models
class Dimension(BaseModel):
    width: int = Field(..., gt=0, description="Width in cm")
    length: int = Field(..., gt=0, description="Length in cm")
    height: int = Field(..., gt=0, description="Height in cm")

class BoxInput(BaseModel):
    width: int = Field(..., gt=0, description="Width in cm")
    length: int = Field(..., gt=0, description="Length in cm") 
    height: int = Field(..., gt=0, description="Height in cm")

class SupplementsInput(BaseModel):
    supplements: Dict[str, Dimension] = Field(
        ..., description="Dictionary of supplement names with their dimensions"
    )
    box_size: Optional[BoxInput] = Field(
        None, description="Optional box dimensions. If not provided, optimal size will be calculated."
    )
    
# Define response models
class BoxOutput(BaseModel):
    width: int
    length: int
    height: int
    volume: int
    utilization: float

class PackedItem(BaseModel):
    name: str
    width: int
    length: int
    height: int
    position: Tuple[int, int, int]
    rotation: int

class PackingResult(BaseModel):
    box: BoxOutput
    packed_items: List[PackedItem]
    unpacked_items: List[str]
    total_items_packed: int
    total_items_unpacked: int

@app.post("/optimize", response_model=PackingResult)
async def optimize_packing(input_data: SupplementsInput):
    """
    Optimize the packing of supplements into a box.
    If box dimensions are provided, it will use those.
    Otherwise, it will calculate the optimal box size.
    """
    try:
        # Convert input data to the format expected by our algorithm
        supplements_data = {
            name: {"width": dim.width, "length": dim.length, "height": dim.height}
            for name, dim in input_data.supplements.items()
        }
        
        box_size = None
        if input_data.box_size:
            box_size = (
                input_data.box_size.width,
                input_data.box_size.length,
                input_data.box_size.height
            )
        
        # Run the packing algorithm
        result = pack_supplements(supplements_data, box_size)
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/from_excel")
async def optimize_from_excel(file: bytes = Body(...)):
    """
    Process an Excel file containing supplement data and optimize packing.
    Expected Excel format:
    - Column A: Supplement name
    - Column B: Width (cm)
    - Column C: Length (cm)
    - Column D: Height (cm)
    """
    try:
        # Read Excel data
        df = pd.read_excel(file)
        
        # Convert to expected format
        supplements_data = {}
        for _, row in df.iterrows():
            supplements_data[row['name']] = {
                "width": int(row['width']),
                "length": int(row['length']),
                "height": int(row['height'])
            }
        
        # Run optimization
        result = pack_supplements(supplements_data)
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/example_data")
async def get_example_data():
    """Return example supplement data for testing"""
    return {
        "whey-protein": {
            "width": 16,
            "length": 16,
            "height": 25
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)