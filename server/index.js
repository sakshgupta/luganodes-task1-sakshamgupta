const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

const subscriptionRouter = require("./routes/subscriptionRoute");

const authRouter = require("./routes/authRoute");
const limitRouter = require("./routes/limitsRoute");
const userRouter = require("./routes/userRoute");

dotenv.config();

// console.log("in index - ", process.env.MONGO_ATLAS_URI);
    
mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGO_ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        require("./controllers/dailyChecker");
        require("./controllers/limitChecker");
    })
    .catch((err) => {
        console.log(err);
    });

require('./models/user')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/notify", subscriptionRouter);
app.use("/user", authRouter);
app.use("/notify", limitRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
    res.send("Currency web app backend.");
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Server Running🚀: http://localhost:5000/");
});