// ProductManager.tsx
import React, { useState } from "react";
import "./ProductManager.css";

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

interface ProductManagerProps {
  initialProducts: Product[];
  onProductsChange: (products: Product[]) => void;
}

const DEFAULT_PRODUCTS: Product[] = [
  { name: "Whey Protein", dimensions: { width: 16, length: 16, height: 26 }, color: "#ff5733", quantity: 1 },
  { name: "Pre-Workout", dimensions: { width: 12, length: 12, height: 12 }, color: "#33ff57", quantity: 1 },
  { name: "Creatine", dimensions: { width: 12, length: 12, height: 12 }, color: "#3357ff", quantity: 1 },
  { name: "Multivitamin", dimensions: { width: 7, length: 7, height: 14 }, color: "#f3ff33", quantity: 1 },
  { name: "Thermogenic", dimensions: { width: 7, length: 7, height: 12 }, color: "#ff33f3", quantity: 1 },
  { name: "Whey Trial", dimensions: { width: 2, length: 11, height: 16 }, color: "#33fff3", quantity: 1 },
];

const ProductManager: React.FC<ProductManagerProps> = ({ initialProducts = DEFAULT_PRODUCTS, onProductsChange }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    dimensions: { width: 10, length: 10, height: 10 },
    color: "#cccccc",
    quantity: 1,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Update quantity for a product
  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 0) return;

    const updatedProducts = [...products];
    updatedProducts[index].quantity = quantity;
    setProducts(updatedProducts);
    onProductsChange(updatedProducts);
  };

  // Handle adding a new product
  const handleAddProduct = () => {
    if (!newProduct.name) return;

    const updatedProducts = [...products, { ...newProduct }];
    setProducts(updatedProducts);
    onProductsChange(updatedProducts);

    // Reset form
    setNewProduct({
      name: "",
      dimensions: { width: 10, length: 10, height: 10 },
      color: "#cccccc",
      quantity: 1,
    });
    setShowAddForm(false);
  };

  // Handle input change for new product
  const handleInputChange = (
    field: "name" | "color" | "quantity" | "width" | "length" | "height",
    value: string | number
  ) => {
    if (field === "name" || field === "color") {
      setNewProduct({ ...newProduct, [field]: value });
    } else if (field === "quantity") {
      setNewProduct({ ...newProduct, quantity: Math.max(1, Number(value)) });
    } else {
      // Handle dimension fields
      setNewProduct({
        ...newProduct,
        dimensions: {
          ...newProduct.dimensions,
          [field]: Math.max(1, Number(value)),
        },
      });
    }
  };

  // Generate a random color
  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    setNewProduct({ ...newProduct, color });
  };

  // Reset to default products
  const resetToDefaults = () => {
    setProducts(DEFAULT_PRODUCTS);
    onProductsChange(DEFAULT_PRODUCTS);
  };

  return (
    <div className="product-manager">
      <div className="product-list">
        <div className="product-list-header">
          <h3>Products</h3>
          <div className="header-actions">
            <button className="btn-small btn-secondary" onClick={resetToDefaults} title="Reset to default products">
              Reset
            </button>
            <button className="btn-small btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? "Cancel" : "Add Product"}
            </button>
          </div>
        </div>

        {/* Product cards */}
        <div className="product-cards">
          {products.map((product, index) => (
            <div className="product-card" key={index}>
              <div className="color-indicator" style={{ backgroundColor: product.color }}></div>
              <div className="product-details">
                <h4>{product.name}</h4>
                <p className="dimensions">
                  {product.dimensions.width} × {product.dimensions.length} × {product.dimensions.height} cm
                </p>
                <div className="quantity-control">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(index, product.quantity - 1)}
                    disabled={product.quantity <= 0}
                  >
                    −
                  </button>
                  <span>{product.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(index, product.quantity + 1)}>
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add new product form */}
        {showAddForm && (
          <div className="add-product-form">
            <h4>Add New Product</h4>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Width (cm)</label>
                <input
                  type="number"
                  value={newProduct.dimensions.width}
                  onChange={(e) => handleInputChange("width", e.target.value)}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Length (cm)</label>
                <input
                  type="number"
                  value={newProduct.dimensions.length}
                  onChange={(e) => handleInputChange("length", e.target.value)}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={newProduct.dimensions.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  min="1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group color-picker">
                <label>Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    value={newProduct.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                  />
                  <button className="btn-small" onClick={generateRandomColor} title="Generate random color">
                    Random
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  min="1"
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddProduct} disabled={!newProduct.name}>
                Add Product
              </button>
            </div>
          </div>
        )}

        {/* Total products summary */}
        <div className="products-summary">
          <div className="summary-item">
            <span>Total Product Types:</span>
            <span>{products.length}</span>
          </div>
          <div className="summary-item">
            <span>Total Items:</span>
            <span>{products.reduce((sum, product) => sum + product.quantity, 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
