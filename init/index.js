const mongoose = require('mongoose');
const initData = require('../init/data.js');
const Listing = require('../models/listing.js');


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(()=> {console.log('Connected to MongoDB');
})
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