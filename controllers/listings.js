const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const axios = require("axios");

// INDEX
module.exports.index = async (req, res) => {
  let filter = {};

  // Category filter 
  if (req.query.category) {
    filter.category = req.query.category.toLowerCase();
  }

  // Search filter 
  if (req.query.search) {
    const search = req.query.search;

    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } }
    ];
  }

  const allListings = await Listing.find(filter);

  res.render("listings/index.ejs", { 
    allListings,
    search: req.query.search
  });
};
// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// SHOW
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// CREATE
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  const location = req.body.listing.location;

  // fallback (only if API fails)
  let geometry = {
    type: "Point",
    coordinates: [77.2090, 28.6139],
  };

  try {
    const geoRes = await axios.get(
      "http://api.positionstack.com/v1/forward",
      {
        params: {
          access_key: process.env.POSITIONSTACK_API_KEY,
          query: location,
        },
      }
    );

    if (geoRes.data.data.length > 0) {
      const { latitude, longitude } = geoRes.data.data[0];

      geometry = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    } else {
      console.log("No results found, using fallback");
    }
  } catch (err) {
    console.log("Geocoding error:", err.message);
  }

  newListing.geometry = geometry;

  await newListing.save();

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (req.body.listing.location) {
    try {
      const geoRes = await axios.get(
        "http://api.positionstack.com/v1/forward",
        {
          params: {
            access_key: process.env.POSITIONSTACK_API_KEY,
            query: req.body.listing.location,
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
      }
    } catch (err) {
      console.log("Update geocoding error:", err.message);
    }
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    throw new ExpressError(404, "Listing not found");
  }

  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};