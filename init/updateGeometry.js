const mongoose = require("mongoose");
const axios = require("axios");
const Listing = require("../models/listing");

require("dotenv").config();
const MONGO_URL = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
}

main();

const updateAllListings = async () => {
  const listings = await Listing.find({});

  for (let listing of listings) {
    try {
      const geoRes = await axios.get(
        "http://api.positionstack.com/v1/forward",
        {
          params: {
            access_key: "eae12276032c6a13e341f306bb447e60",
            query: listing.location,
          },
        }
      );

      if (geoRes.data.data.length > 0) {
        const { latitude, longitude } = geoRes.data.data[0];

        listing.geometry = {
          type: "Point",
          coordinates: [longitude, latitude],
        };

        await listing.save();
        console.log(`Updated: ${listing.title}`);
      } else {
        console.log(`No result for: ${listing.title}`);
      }

      // prevent rate limit
      await new Promise(res => setTimeout(res, 1000));

    } catch (err) {
      console.log("Error:", listing.title);
    }
  }

  console.log("All listings updated!");
};

updateAllListings();