console.log("NEW COMMON JS LOADED");

function getProductImage(product) {
const img = (product?.image || product?.images?.[0] || "")
  .trim()
  .replace(/\s+/g, " "); // normalize spaces

  if (!img) {
    return "/Users%20Side/images/default.png";
  }

  if (img.startsWith("http://16.171.151.84:5000/uploads/")) {
    return img.replace("http://16.171.151.84:5000", "");
  }

  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }

  if (img.startsWith("uploads/")) {
    return "/uploads/" + encodeURIComponent(img.replace("uploads/", ""));
  }

  if (img.startsWith("/uploads/")) {
    return encodeURI(img);
  }

  if (img.startsWith("images/")) {
    return `/${encodeURI(img)}`;
  }

  return `/uploads/${encodeURI(img)}`;
}