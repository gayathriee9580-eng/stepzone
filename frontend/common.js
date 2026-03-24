function getProductImage(product) {
  const img = (product?.image || product?.images?.[0] || "").trim();

  if (!img) {
    return "/Users%20Side/images/default.png";
  }

  // Old DB values like http://16.171.151.84:5000/uploads/...
  if (img.startsWith("http://16.171.151.84:5000/uploads/")) {
    return img.replace("http://16.171.151.84:5000", "");
  }

  // Keep other external absolute URLs
  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }

  // uploads/file.jpg -> /uploads/file.jpg
  if (img.startsWith("uploads/")) {
    return `/${encodeURI(img)}`;
  }

  // already /uploads/file.jpg
  if (img.startsWith("/uploads/")) {
    return encodeURI(img);
  }

  // local frontend image
  if (img.startsWith("images/")) {
    const isAdminPage =
      window.location.pathname.includes("Admin%20side") ||
      window.location.pathname.includes("Admin side");

    return isAdminPage
      ? `../Users Side/${encodeURI(img)}`
      : `./${encodeURI(img)}`;
  }

  // plain filename
  return `/uploads/${encodeURI(img)}`;
}