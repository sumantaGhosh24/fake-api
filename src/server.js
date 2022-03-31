require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8080",
      "http://localhost:8000",
    ],
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

mongoose.connect(process.env.MONGODB_URL, {autoIndex: false}, (err) => {
  if (err) throw err;
  console.log("Database Connection Successful.");
});

app.use("/api", require("./routes"));

app.listen(PORT, () => {
  console.log(`Application Listening on http://localhost:${PORT}`);
});
