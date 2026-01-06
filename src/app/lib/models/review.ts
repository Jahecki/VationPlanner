import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

// Prevent duplicate reviews from the same user on the same trip
ReviewSchema.index({ userId: 1, tripId: 1 }, { unique: true });

const Review = models.Review || model("Review", ReviewSchema);

export default Review;
