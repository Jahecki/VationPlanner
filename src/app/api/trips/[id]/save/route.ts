import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Trip from "@/app/lib/models/trip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import User from "@/app/lib/models/user";

// POST /api/trips/[id]/save
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params; // originalTripId
        await connectDB();

        // Get current user ID
        let userId = (session.user as any).id;
        if (!userId) {
            const user = await User.findOne({ email: session.user.email });
            if (user) userId = user._id;
        }

        // Fetch original trip
        const originalTrip = await Trip.findById(id).lean();
        if (!originalTrip) {
            return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        }

        // Create a copy
        // We strip _id, createdAt, updatedAt, and set new userId
        const { _id, createdAt, updatedAt, userId: originalOwnerId, isPublic, ...tripData } = originalTrip;

        const newTrip = await Trip.create({
            ...tripData,
            userId,
            originalTripId: id,
            isPublic: false, // Default to private when saved
            status: "planowana", // Reset status
        });

        return NextResponse.json(newTrip, { status: 201 });
    } catch (error) {
        console.error("Error saving trip:", error);
        return NextResponse.json({ error: "Failed to save trip" }, { status: 500 });
    }
}
