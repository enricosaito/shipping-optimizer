interface ProductImageMapping {
  keywords: string[];
  imagePath: string;
}

export const productImageMappings: ProductImageMapping[] = [
  {
    keywords: ["creatina", "creatine"],
    imagePath: "/assets/product-images/creatina.jpg",
  },
  {
    keywords: ["pre treino", "pre-treino", "pretreino"],
    imagePath: "/assets/product-images/pre-treino.jpg",
  },
  {
    keywords: ["termogênico", "termogenico"],
    imagePath: "/assets/product-images/termogenico.jpg",
  },
  {
    keywords: ["whey 900g", "whey 900"],
    imagePath: "/assets/product-images/whey-900g.jpg",
  },
  {
    keywords: ["whey 320g", "whey 320"],
    imagePath: "/assets/product-images/whey-320g.jpg",
  },
];

export const getProductImagePath = (productName: string): string | null => {
  const normalizedName = productName.toLowerCase();

  for (const mapping of productImageMappings) {
    if (mapping.keywords.some((keyword) => normalizedName.includes(keyword.toLowerCase()))) {
      return mapping.imagePath;
    }
  }

  return null;
};
