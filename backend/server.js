const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.route.js");
const connectMongoDB = require("./db/connectMongoDB.js");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// Use morgan for logging with the 'combined' format
app.use(morgan("combined"));

// Use express's built-in JSON and URL-encoded middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});
