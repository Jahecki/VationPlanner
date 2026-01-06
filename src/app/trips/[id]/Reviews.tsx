"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare } from "lucide-react";
import { useLanguage } from "@/app/lib/context/LanguageContext";

interface Review {
    _id: string;
    userId: {
        _id: string;
        name: string;
        image?: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewsProps {
    tripId: string;
    isOwner: boolean;
}

export default function Reviews({ tripId, isOwner }: ReviewsProps) {
    const { data: session } = useSession();
    const { t } = useLanguage();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [tripId]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/trips/${tripId}/reviews`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`/api/trips/${tripId}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating: newRating, comment: newComment }),
            });

            if (res.ok) {
                setNewRating(5);
                setNewComment("");
                fetchReviews(); // Refresh list
            } else {
                const err = await res.json();
                alert(err.error || "Błąd dodawania opinii");
            }
        } catch (error) {
            alert("Wystąpił błąd");
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div className="space-y-8">
            <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        {t("reviews.title")}
                    </h3>
                    <p className="text-muted-foreground text-sm">{t("reviews.average")}: <span className="text-yellow-400 font-bold text-lg">{averageRating}</span> ({reviews.length})</p>
                </div>
                {!isOwner && session && (
                    <div className="text-right">
                        {/* Formularz dodawania opinii poniżej */}
                    </div>
                )}
            </div>

            {/* Formularz (tylko dla odwiedzających) */}
            {isOwner ? (
                <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl text-muted-foreground">
                    <p>{t("reviews.owner")}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-card border border-border p-6 rounded-2xl space-y-4">
                    <h4 className="font-bold text-foreground">{t("reviews.add")}</h4>

                    <div>
                        <label className="text-xs text-muted-foreground uppercase font-bold mb-2 block">{t("reviews.rating")}</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setNewRating(star)}
                                    className={`text-2xl transition-transform hover:scale-110 ${star <= newRating ? "grayscale-0" : "grayscale opacity-30"}`}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground uppercase font-bold mb-2 block">{t("reviews.comment")}</label>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={t("reviews.placeholder")}
                            className="w-full bg-background/50 border border-input rounded-lg px-4 py-3 focus:border-primary outline-none text-foreground text-sm min-h-[100px]"
                            required
                        />
                    </div>

                    <button
                        disabled={submitting}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
                    >
                        {submitting ? t("reviews.sending") : t("reviews.send")}
                    </button>
                </form>
            )}

            {/* Lista opinii */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">{t("reviews.empty")}</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="p-6 bg-card border border-border rounded-2xl">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                                        {review.userId?.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-foreground">{review.userId?.name || "Użytkownik"}</p>
                                        <div className="flex text-yellow-500 text-xs">
                                            {'★'.repeat(review.rating)}
                                            <span className="text-muted-foreground ml-1">({review.rating}/5)</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
