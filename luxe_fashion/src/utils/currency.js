// Currency utility for Indian Rupees

export const formatCurrency = (amount) => {
  return `₹${amount.toFixed(2)}`;
};

// For backward compatibility, but now just returns the same amount without conversion
export const convertUSDToINR = (amount) => {
  return amount;
};

export const formatINR = (amount) => {
  return `₹${amount.toFixed(2)}`;
};

// For backward compatibility, but now formats as INR
export const formatUSD = (amount) => {
  return `₹${amount.toFixed(2)}`;
};