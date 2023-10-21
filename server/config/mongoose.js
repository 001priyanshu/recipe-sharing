const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error on connectin to database"));

db.once("open", () => {
  console.log(`Successfully connected to database`);
});
