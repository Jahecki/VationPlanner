import mongoose, { Schema, model, models } from "mongoose";

const TripSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    destination: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    peopleCount: { type: Number, default: 1 },

    hotels: [
      {
        name: { type: String, required: true },
        address: { type: String },
        price: { type: Number, default: 0 },
        currency: { type: String, default: "PLN" },
        rating: { type: Number, default: 0 },
        image: { type: String },
        checkIn: { type: Date },
        checkOut: { type: Date },
      }
    ],
    isPublic: { type: Boolean, default: false },
    originalTripId: { type: Schema.Types.ObjectId, ref: "Trip" },

    itinerary: [
      {
        date: { type: Date },
        activities: [
          {
            time: { type: String },
            description: { type: String },
            cost: { type: Number, default: 0 }
          }
        ]
      }
    ],
    status: { type: String, default: "planowana" },
  },
  { timestamps: true }
);

const Trip = models.Trip || model("Trip", TripSchema);

export default Trip;