const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route.js");
const userRoutes = require("./routes/user.routes.js");  // CommonJS import
const connectMongoDB = require("./db/connectMongoDB.js");

dotenv.config();

const app = express();

// Use morgan for logging with the 'combined' format
app.use(morgan("combined"));

// Use CORS if needed
app.use(cors());

// Use express's built-in JSON and URL-encoded middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use cookie-parser middleware
app.use(cookieParser());

// Connect to MongoDB
connectMongoDB();

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);  // CommonJS import

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});
