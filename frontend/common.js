const API_BASE_URL = "http://16.171.151.84:5000";

function getProductImage(product) {
  const img = (product?.image || product?.images?.[0] || "").trim();

  if (!img) {
    return "../Users Side/images/default.png";
  }

  if (img.startsWith("http")) {
    return img;
  }

  if (img.startsWith("uploads/")) {
    return `${API_BASE_URL}/${encodeURI(img)}`;
  }

  if (img.startsWith("images/")) {
    const isAdminPage =
      window.location.pathname.includes("Admin%20side") ||
      window.location.pathname.includes("Admin side");

    return isAdminPage
      ? `../Users Side/${encodeURI(img)}`
      : `./${encodeURI(img)}`;
  }

  return `${API_BASE_URL}/uploads/${encodeURI(img)}`;
}