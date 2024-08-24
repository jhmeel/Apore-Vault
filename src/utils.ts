export const formatAmount = (amount: number) => {
  if (Math.abs(amount) >= 1) {
    return amount.toFixed(2);
  }

  const precision = Math.abs(amount) >= 0.01 ? 4 : 6;
  return parseFloat(amount.toFixed(precision)).toString();
};
