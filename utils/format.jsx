export const formatCurrency = (amount) => {
  if (isNaN(amount)) return "₦0";
  return `₦${amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const opts = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleString("en-US", opts);
};

export const formatDate = (isoString) => {
  const date = new Date(isoString);
  const opts = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  return date.toLocaleDateString("en-US", opts);
};
