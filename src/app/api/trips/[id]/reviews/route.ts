import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Review from "@/app/lib/models/review";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import User from "@/app/lib/models/user";

// GET /api/trips/[id]/reviews
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        await connectDB();

        const reviews = await Review.find({ tripId: id })
            .populate("userId", "name image")
            .sort({ createdAt: -1 });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

// POST /api/trips/[id]/reviews
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params; // tripId
        const { rating, comment } = await req.json();

        if (!rating || !comment) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await connectDB();

        // Check if user already reviewed this trip
        // Assuming session.user.id is available, if not we need to find user by email
        let userId = (session.user as any).id;
        if (!userId) {
            const user = await User.findOne({ email: session.user.email });
            if (user) userId = user._id;
        }

        if (!userId) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const existingReview = await Review.findOne({ userId, tripId: id });
        if (existingReview) {
            return NextResponse.json({ error: "You have already reviewed this trip" }, { status: 409 });
        }

        const newReview = await Review.create({
            userId,
            tripId: id,
            rating,
            comment,
        });

        const populatedReview = await newReview.populate("userId", "name image");

        return NextResponse.json(populatedReview, { status: 201 });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }
}
