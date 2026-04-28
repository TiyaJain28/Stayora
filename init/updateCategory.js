const mongoose = require("mongoose");
const Listing = require("../models/listing");
require("dotenv").config();
const MONGO_URL = process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
}

main();

const updateCategories = async () => {
  const listings = await Listing.find({});

  for (let listing of listings) {
    let category = "trending";

   
    const text = (listing.title + listing.description).toLowerCase();

    if (text.includes("mountain")) category = "mountains";
    else if (text.includes("pool")) category = "pools";
    else if (text.includes("camp")) category = "camping";
    else if (text.includes("farm")) category = "farms";
    else if (text.includes("city")) category = "iconic";

    listing.category = category;
    await listing.save();

    console.log(`Updated: ${listing.title} → ${category}`);
  }

  console.log("All categories updated!");
};

updateCategories();