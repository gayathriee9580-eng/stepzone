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
    return `/Users%20Side/${encodeURI(img)}`;
  }

  return `/uploads/${encodeURI(img)}`;
}



async function loadCartCount() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("/api/cart", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    const count = data.products?.length || 0;

    const cartIcon = document.querySelector(".fa-shopping-cart");
    let badge = document.getElementById("cart-count");

    if (!badge) {
      badge = document.createElement("span");
      badge.id = "cart-count";
      badge.style.position = "absolute";
      badge.style.top = "-5px";
      badge.style.right = "-10px";
      badge.style.background = "red";
      badge.style.color = "white";
      badge.style.fontSize = "12px";
      badge.style.padding = "2px 6px";
      badge.style.borderRadius = "50%";

      cartIcon.parentElement.style.position = "relative";
      cartIcon.parentElement.appendChild(badge);
    }

    badge.innerText = count;

  } catch (err) {
    console.error("Cart count error:", err);
  }
}