require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend API is running" });
});

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();