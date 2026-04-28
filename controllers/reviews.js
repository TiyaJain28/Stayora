const Review = require("../models/review");
const Listing = require("../models/listing");




module.exports.createReview=async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  const newReview = new Review(req.body.review);
   newReview.rating = Number(req.body.review.rating);
  newReview.author=req.user._id; 
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
     req.flash("success","New Review created!");
  res.redirect(`/listings/${listing._id}`);
}


module.exports.destroyReview=async (req, res) => {

    let { id, reviewId } = req.params;

    // Remove review reference from listing
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });

    // Delete review from Review collection
    await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);
  }