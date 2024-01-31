const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const { tokenVerify, getAdmin } = require('./jwt')
require("dotenv").config();
const { User } = require("./models/user");
const bcrypt = require('bcrypt');

console.log("Permainan")

// const { routes } = require("./routes/demo");
const { authRoutes } = require("./routes/auth");
const { userRoutes } = require("./routes/userRoutes");
const { courseRoutes } = require("./routes/courseRoutes");
const { courseCORoutes } = require("./routes/courseCORoutes");
const { curriculumRoutes } = require("./routes/curriculumRoutes");
const { termRoutes } = require("./routes/termRoutes");
const { assessmentRoutes } = require("./routes/assessmentRoutes");
const { attainmentRoutes } = require("./routes/attainmentRoutes");
const { surveyRoutes } = require("./routes/surveyRoutes");
const { totalCoAttainmentRoutes } = require("./routes/totalCoAttainmentRoutes");
const { poAttainmentRoutes } = require("./routes/poAttainment");
const { totalPoAttainmentRoutes } = require("./routes/totalPoAttainmentRoutes");
const { attainmentGapRoutes } = require("./routes/attainmentGapRoutes");

const app = express();
const server = require('http').createServer(app);
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
})); // Cross-Origin Resource Sharing (CORS) Middleware
app.use(morgan("dev")); // HTTP Request Logger Middleware for node.js
app.use(express.json()); // The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use("/api", routes);
app.use("/auth", authRoutes);
// app.use("/users", userRoutes);
app.use("/users", tokenVerify, userRoutes);
app.use("/courses", tokenVerify, courseRoutes);
app.use("/course-outcomes", tokenVerify, courseCORoutes);
app.use("/curriculums", tokenVerify, curriculumRoutes);
app.use("/terms", tokenVerify, termRoutes);
app.use("/assessments", tokenVerify, assessmentRoutes);
app.use("/attainments", tokenVerify, attainmentRoutes);
app.use("/surveys", tokenVerify, surveyRoutes);
app.use("/totalcoattainments", tokenVerify, totalCoAttainmentRoutes);
app.use("/co_po_mapping", tokenVerify, poAttainmentRoutes);
app.use("/totalpoattainments", tokenVerify, totalPoAttainmentRoutes);
app.use("/attainmentgaps", tokenVerify, attainmentGapRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_PROD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((value) => {
    console.log(">>> Mongoose is connected ");
}, (error) => {
    console.log(">>> Error: ", error);
});

// Base Route
app.get("/", (req, res) => {
    res.json({
        date: new Date(),
        port: PORT,
        dirName: __dirname,
    });
});

const createUser = async() => {
        const user = new User({ "username": process.env.USER_USERNAME, "password": "password", email: "admin@gmail.com", firstName: "first", lastName: "last", superAdmin: true });
        user.password = await bcrypt.hash(process.env.USER_PASSWORD, 10);

        // res.status(200).json({ ...user['_doc'] })
        user.save((error, message) => {
            if (error) {
                console.log("Error", error);
            } else {
                console.log("User Added Successfully", message);
            }
        });
    }
    // To create user admin firstime to true
    // const firstime = true
const firstime = false
if (firstime) {
    createUser()
}

console.log("Hellp")
server.listen(PORT, () => console.log(`App Running On ${PORT}`));
// app.listen(PORT, () => console.log(`App Running On ${PORT}`));