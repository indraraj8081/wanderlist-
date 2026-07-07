require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
async function main() {
    await mongoose.connect(dbUrl);
}

main()
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));
// ak function bana lenga initdb


const initDB= async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({
       ...obj,
      owner: "6a479090b118d5ba2608bfbc" // Replace with actual owner ID
    }));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
};

initDB();