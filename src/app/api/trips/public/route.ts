import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Trip from "@/app/lib/models/trip";
import User from "@/app/lib/models/user"; // Ensure User model is registered

import Review from "@/app/lib/models/review";

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");
        const minRating = searchParams.get("minRating");

        console.log("Fetching public trips with filters:", { search, minRating });

        const matchStage: any = { isPublic: true };

        if (search) {
            // Case-insensitive regex search for destination
            matchStage.destination = { $regex: search, $options: "i" };
        }

        const pipeline: any[] = [
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            { $limit: 50 }, // Increased limit
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "tripId",
                    as: "reviews"
                }
            },
            {
                $addFields: {
                    averageRating: {
                        $cond: {
                            if: { $eq: [{ $size: "$reviews" }, 0] },
                            then: 0,
                            else: { $avg: "$reviews.rating" }
                        }
                    },
                    reviewsCount: { $size: "$reviews" }
                }
            },
            {
                $project: {
                    "user.password": 0,
                    reviews: 0
                }
            }
        ];

        if (minRating) {
            const ratingValue = parseFloat(minRating);
            if (!isNaN(ratingValue) && ratingValue > 0) {
                pipeline.push({
                    $match: { averageRating: { $gte: ratingValue } }
                });
            }
        }

        const trips = await Trip.aggregate(pipeline);

        return NextResponse.json(trips);
    } catch (error) {
        console.error("Error fetching public trips:", error);
        return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
    }
}
