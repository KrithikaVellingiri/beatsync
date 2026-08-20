const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const healthRoutes = require("./routes/health.routes");
const storeRoutes = require("./routes/store.routes");
const skuRoutes = require("./routes/sku.routes");
const beatRoutes = require("./routes/beat.routes");
const deliveryRoutes = require("./routes/delivery.routes");
const storeOwnerRoutes = require("./routes/storeOwner.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
 
// Routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/skus", skuRoutes);
app.use("/api/beats", beatRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/store-owner", storeOwnerRoutes);
app.use("/api/orders", orderRoutes);
 
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BeatSync backend is running",
  });
});

app.use("/api/auth", authRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = app;