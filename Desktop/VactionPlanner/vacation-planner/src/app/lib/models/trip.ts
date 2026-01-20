// plik: src/app/lib/models/trip.ts
import mongoose, { Schema, model, models } from "mongoose";

const TripSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    destination: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    peopleCount: { type: Number, default: 1 },
    
    // --- ZMIANA: ROZBUDOWANY OBIEKT HOTELU ---
    hotels: [
      {
        name: { type: String, required: true },
        address: { type: String },
        price: { type: Number, default: 0 }, // Cena za pobyt
        currency: { type: String, default: "PLN" },
        rating: { type: Number, default: 0 }, // Gwiazdki
      }
    ],
    
    itinerary: [
      {
        date: { type: Date },
        activities: [
          {
            time: { type: String },
            description: { type: String }
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