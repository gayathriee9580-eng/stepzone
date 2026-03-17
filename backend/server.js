
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const connectDB = require("./config/db");
const fs = require("fs");
const path = require("path");

const app = express();
const swaggerSpec = require("./swagger");

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

app.use(cors());
app.use(express.json());

connectDB();

app.use("/admin", express.static(path.join(__dirname, "../frontend/Admin Side")));
app.use("/images", express.static("images"));
app.use("/uploads", express.static(uploadsDir));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const mainRouter = require("./routes/mainRoutes");
app.use("/api", mainRouter);

app.use(express.static(path.join(__dirname, "../frontend/Users Side")));

app.get("/", (req, res) => res.send("Backend Running..."));



// app.get(/^(?!\/api).*$/, (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/Users Side/forgot_password.html"));
// });

app.get(/^(?!\/api|\/uploads).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/Users Side/forgot_password.html"));
});

// Start Server
 const PORT = process.env.PORT || 5000;

 app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
 });



