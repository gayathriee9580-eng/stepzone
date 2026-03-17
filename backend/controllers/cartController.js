const Cart = require("../models/cart");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const { getApplicableOffer } = require("../utils/offerutils");

// Add product to cart
// Route: POST /api/cart/add
// Access: User
// Body: { productId }
// Response: Cart object with added product
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

let cart = await Cart.findOne({ user: new mongoose.Types.ObjectId(userId) });

const product = await Product.findById(productId);

if (!product) {
  return res.status(404).json({ message: "Product not found" });
}

    const offer = await getApplicableOffer(product);

let discountedPrice = product.price;
if (offer) {
  if (offer.discountPercentage) {
    discountedPrice = product.price * (1 - offer.discountPercentage / 100);
  } 
  else if (offer.discountValue) {
    discountedPrice = product.price - offer.discountValue;
  }
}

discountedPrice = Math.max(discountedPrice, 0); // negative prevent


    if (!cart) {
      // Create new cart
        cart = await Cart.create({
        user: new mongoose.Types.ObjectId(userId),
        products: [{
          product: productId,
          quantity: 1,
          price: product.price,
          discountedPrice
        }]
      });
    } else {
      const existingProductIndex = cart.products.findIndex(
        item => item.product.toString() === productId.toString()
      );

      if (existingProductIndex > -1) {
        // Increase quantity if product already in cart
        cart.products[existingProductIndex].quantity += 1;
      } else {
        // Add new product with price info
        cart.products.push({
          product: productId,
          quantity: 1,
          price: product.price,
          discountedPrice
        });
      }

      await cart.save();
    }

    res.json({ message: "Product added to cart", cart });

  } catch (error) {
    console.error("Cart Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get current user's cart
// Route: GET /api/cart
// Access: User
// Response: List of cart products
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: new mongoose.Types.ObjectId(req.user.userId)
    }).populate("products.product");

    if (!cart) {
      return res.json({ products: [] });
    }

    res.json({ products: cart.products });

  } catch (err) {
    console.error("Get Cart Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Remove product from cart
// Route: DELETE /api/cart/:productId
// Access: User
// Params: productId
// Response: confirmation message
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

const cart = await Cart.findOne({ 
  user: new mongoose.Types.ObjectId(req.user.userId) 
});

  cart.products = cart.products.filter(
    item => item.product.toString() !== productId
  );

  await cart.save();

  res.json({ message: "Removed from cart" });
};


// Update product quantity in cart
// Route: PUT /api/cart/:productId
// Access: User
// Body: { change }
// change = +1 or -1
// Response: confirmation message
exports.updateQuantity = async (req, res) => {
  const { productId } = req.params;
  const { change } = req.body;

const cart = await Cart.findOne({ 
  user: new mongoose.Types.ObjectId(req.user.userId) 
});

  const item = cart.products.find(
    item => item.product.toString() === productId
  );

  if (!item) return res.status(404).json({ message: "Item not found" });

  item.quantity += change;

  if (item.quantity <= 0) {
    cart.products = cart.products.filter(
      item => item.product.toString() !== productId
    );
  }

  await cart.save();

  res.json({ message: "Quantity updated" });
};

// const Cart = require("../models/cart");
// const mongoose = require("mongoose");
// const Product = require("../models/Product");
// const { getApplicableOffer } = require("../utils/offerutils");

// // -------------------- Add to Cart --------------------
// exports.addToCart = async (req, res) => {
//   try {
//     const userId = req.user._id; // assuming auth middleware
//     const { productId } = req.body;

//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     // Calculate discounted price (if you have offer logic)
//     let discountedPrice = product.price; // apply your discount logic here

//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       cart = new Cart({ user: userId, products: [] });
//     }

//     // Check if product exists in cart
//     const existingItem = cart.products.find(p => p.product.toString() === productId);
//     if (existingItem) {
//       existingItem.quantity += 1;
//       existingItem.price = product.price;
//       existingItem.discountedPrice = discountedPrice;
//     } else {
//       cart.products.push({
//         product: productId,
//         quantity: 1,
//         price: product.price,
//         discountedPrice
//       });
//     }

//     await cart.save();

//     res.status(200).json({ message: "Added to cart" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // -------------------- Get Cart --------------------
// exports.getCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user.userId })
//       .populate("products.product");

//     if (!cart) return res.json({ products: [] });

//     res.json({ products: cart.products });

//   } catch (err) {
//     console.error("Get Cart Error:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // -------------------- Remove from Cart --------------------
// exports.removeFromCart = async (req, res) => {
//   const { productId } = req.params;

//   const cart = await Cart.findOne({ user: req.user.userId });
//   if (!cart) return res.status(404).json({ message: "Cart not found" });

//   cart.products = cart.products.filter(
//     item => item.product.toString() !== productId
//   );

//   await cart.save();
//   res.json({ message: "Removed from cart", cart });
// };

// // -------------------- Update Quantity --------------------
// exports.updateQuantity = async (req, res) => {
//   const { productId } = req.params;
//   const { change } = req.body;

//   const cart = await Cart.findOne({ user: req.user.userId });
//   if (!cart) return res.status(404).json({ message: "Cart not found" });

//   const item = cart.products.find(item => item.product.toString() === productId);
//   if (!item) return res.status(404).json({ message: "Item not found" });

//   item.quantity += change;

//   if (item.quantity <= 0) {
//     cart.products = cart.products.filter(i => i.product.toString() !== productId);
//   } else {
//     // Recalculate discountedPrice if offer exists
//     const product = await Product.findById(productId);
//     const offer = await getApplicableOffer(product);

//     let discountedPrice = product.price;
//     if (offer) {
//       if (offer.discountPercentage) discountedPrice = product.price * (1 - offer.discountPercentage / 100);
//       else if (offer.discountValue) discountedPrice = product.price - offer.discountValue;
//     }

//     item.price = Number(product.price);
//     item.discountedPrice = Math.max(Number(discountedPrice), 0);
//   }

//   await cart.save();
//   res.json({ message: "Quantity updated", cart });
// };