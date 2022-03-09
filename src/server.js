require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect(process.env.MONGODB_URL, {autoIndex: false}, (err) => {
  if (err) throw err;
  console.log("Database Connection Successful.");
});

app.use("/api", require("./routes"));

app.listen(PORT, () => {
  console.log(`Application Listening on http://localhost:${PORT}`);
});
