import React, { useState } from 'react';

// Rating Component to display clickable stars
const StarRating = ({ rating, onRatingChange }: { rating: number, onRatingChange: (rating: number) => void }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex space-x-1">
            {stars.map((star) => (
                <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={star <= rating ? 'yellow' : 'gray'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-8 h-8 cursor-pointer"
                    onClick={() => onRatingChange(star)}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 17.27l4.18 2.18-1.64-5.08L20 9.24l-5.19-.42L12 2 9.19 8.82 4 9.24l3.46 4.13-1.64 5.08L12 17.27z"
                    />
                </svg>
            ))}
        </div>
    );
};

const LeaveReview = () => {
    const [review, setReview] = useState<string>('');
    const [rating, setRating] = useState<number>(0);

    // Handle review submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating!');
            return;
        }

        if (review.trim() === '') {
            alert('Please enter a review!');
            return;
        }

        // Handle your form submission logic here (e.g., API call or state update)
        console.log('Review submitted:', review);
        console.log('Rating submitted:', rating);

        // Reset form after submission
        setReview('');
        setRating(0);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4">Leave a Review</h2>
            <form onSubmit={handleSubmit}>
                {/* Review text area */}
                <div className="mb-4">
                    <label htmlFor="review" className="block text-gray-700 text-sm font-medium mb-2">
                        Your Review
                    </label>
                    <textarea
                        id="review"
                        rows={4}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write your review here..."
                    ></textarea>
                </div>

                {/* Star Rating */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Rating</label>
                    <StarRating rating={rating} onRatingChange={setRating} />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Submit Review
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeaveReview;