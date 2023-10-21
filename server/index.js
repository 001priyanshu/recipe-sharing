require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const db = require("./config/mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api/user", require("./routes/user"));
app.use("/api/recipe", require("./routes/recipe"));
app.use("/api/comment", require("./routes/comment"));

app.listen(port, (err) => {
  if (err) {
    console.log("Error in starting the server :", err);
  }
  console.log(`Server is running at port ${port}`);
});
