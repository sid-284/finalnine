// Test script to verify size filtering logic

// Mock product data with different size formats
const testProducts = [
  {
    name: "Product 1 - String Array",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    name: "Product 2 - Object Array",
    sizes: [
      { size: 'XS', available: true },
      { size: 'S', available: true },
      { size: 'M', available: false },
      { size: 'L', available: true },
      { size: 'XL', available: true }
    ]
  },
  {
    name: "Product 3 - Mixed Case",
    sizes: [
      { size: 'xs', available: true },
      { size: 's', available: true },
      { size: 'm', available: true }
    ]
  }
];

// Test filter
const filters = {
  size: ['S', 'M']
};

// Size filtering logic (copied from the main file)
function testSizeFilter(product, filters) {
  if (!product.sizes || !Array.isArray(product.sizes)) return false;
  
  return product.sizes.some(size => {
    // Handle both string format ["XS", "S", "M"] and object format [{size: "XS", available: true}]
    const sizeValue = typeof size === 'string' ? size : size.size;
    const isAvailable = typeof size === 'string' ? true : size.available;
    
    return sizeValue && isAvailable && filters.size.some(selectedSize => 
      selectedSize && selectedSize.toLowerCase() === sizeValue.toLowerCase()
    );
  });
}

// Run tests
console.log('Testing size filter logic:');
console.log('Filter for sizes:', filters.size);
console.log('');

testProducts.forEach(product => {
  const result = testSizeFilter(product, filters);
  console.log(`${product.name}: ${result ? 'PASS' : 'FAIL'}`);
  console.log(`  Sizes: ${JSON.stringify(product.sizes)}`);
  console.log('');
});

// Test data transformation logic
function transformSizes(sizes) {
  return sizes ? 
    (Array.isArray(sizes) ? 
      sizes.map(size => 
        typeof size === 'string' ? 
          { size: size, available: true } : 
          size
      ) : 
      [{ size: 'S', available: true }, { size: 'M', available: true }, { size: 'L', available: true }]
    ) : 
    [{ size: 'S', available: true }, { size: 'M', available: true }, { size: 'L', available: true }];
}

console.log('Testing data transformation:');
testProducts.forEach(product => {
  const transformed = transformSizes(product.sizes);
  console.log(`${product.name}:`);
  console.log(`  Original: ${JSON.stringify(product.sizes)}`);
  console.log(`  Transformed: ${JSON.stringify(transformed)}`);
  console.log('');
});
