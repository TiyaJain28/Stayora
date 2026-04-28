require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("connected to ATLAS DB");
}

main();

const initDB = async () => {
  await Listing.deleteMany({});

  const newData = initData.data.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("69d95172f082b6b1dee4e15a"),
    geometry: {
      type: "Point",
      coordinates: [77.2090, 28.6139],
    },
  }));

  await Listing.insertMany(newData);
  console.log("data inserted into ATLAS ✅");
};

initDB();