export const formatPrice = (price: number | string) => {
  const result = parseFloat(price.toString());
  const integerPart = result.toString().split(".")[0];
  let decimalPart = result.toString().split(".")[1] || "";
  if (integerPart.length + decimalPart.length >= 5) {
    decimalPart = decimalPart.slice(0, Math.max(2, 5 - integerPart.length));
  }
  if (+integerPart >= 10) {
    decimalPart = decimalPart.slice(0, 2);
  }
  return parseFloat(integerPart + "." + decimalPart).toLocaleString();
};

export const formatPriceWithIncrement = (price: number | string, increment: number | string) => {
  const decimals = Math.abs(Math.log10(+increment));
  return (+price).toLocaleString("en-US", { minimumFractionDigits: decimals });
};
