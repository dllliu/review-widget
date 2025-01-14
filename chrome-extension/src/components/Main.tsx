import React, { useState, useEffect } from 'react';
import DropdownMenu from './Dropdown.tsx';
import Home from "./Home.tsx"
import Help from "./Help.tsx"
import LeaveReview from "./LeaveReview.tsx"
import LookAtReviews from "./LookAtReviews.tsx"
import { findProductByUrl, findReviewsByUrl } from "../helpers/database.ts"

interface Product {
    title: string;
    description: string;
}

interface Review {
    id: string
    review: string;
    rating: number;
    category: string;
    upvotes: number;
}

const Main: React.FC = () => {
    const [currentUrl, setCurrentUrl] = useState(""); // State to hold the URL
    const [productData, setProductData] = useState<Product | null>(null); // Now it can hold null if no product data
    const [_reviewsData, setReviewsData] = useState<Review[] | null>(null); // Now it can hold null if no product data
    const [currentPage, setCurrentPage] = useState<string>('home');

    useEffect(() => {
        const fetchData = async () => {
            // Send message to the background script to get the current URL
            chrome.runtime.sendMessage({ action: "getCurrentUrl" }, (response) => {
                const url = response?.url; // Get the URL from the response
                if (url) {
                    setCurrentUrl(url); // Set the current URL in state
                }
            });
        };

        fetchData(); // Fetch data when the component mounts
    }, []); // Empty dependency array, meaning this runs once after the component mounts

    // React to changes in currentUrl and fetch product data when it's updated
    useEffect(() => {
        if (currentUrl && currentUrl.startsWith("http")) {
            // Proceed only if currentUrl is valid
            const processUrl = async (url: string) => {
                try {
                    const data = await findProductByUrl(url); // Fetch the product data
                    if (data && data.length > 0) {
                        const product = {
                            title: data[0].title, // Assuming data[0] contains the product
                            description: data[0].description
                        };
                        setProductData(product);
                        console.log("Product found:", product);
                    } else {
                        console.error("No product data found");
                        setProductData(null); // Handle the case where no product is found
                    }
                } catch (error) {
                    console.error("Error processing the URL:", error);
                }
                try {
                    const data = await findReviewsByUrl(url); // Fetch the product data
                    if (data && data.length > 0) {
                        const reviewsArray = data.map((item) => {
                            return {
                                review: item.review,
                                rating: item.rating,
                                category: item.category,
                                upvotes: item.upvotes,
                                id: item.id
                            };
                        });
                        setReviewsData(reviewsArray);
                        console.log("Reviews found:", reviewsArray);
                    } else {
                        console.error("No product data found");
                        setProductData(null); // Handle the case where no product is found
                    }
                } catch (error) {
                    console.error("Error processing the URL:", error);
                }
            };

            processUrl(currentUrl); // Call the function to process the URL
        } else if (currentUrl) {
            console.error("Invalid URL format:", currentUrl);
        }
    }, [currentUrl]); // This effect will run whenever currentUrl changes


    const handlePageChange = (page: string) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-96 relative max-h-screen overflow-y-auto" style={{ minHeight: '450px' }}>
            {/* Header with logo and help button */}
            <div className="flex justify-between items-center mb-4">
                <img src="/icons/logoGenie-48.png" alt="Logo" className="w-8 h-8" />
                <DropdownMenu onPageChange={handlePageChange} />
            </div>

            {/* Conditionally render content based on the selected page */}
            {currentPage === 'home' && <Home productData={productData} />}
            {currentPage === 'leaveReview' && <LeaveReview />}
            {currentPage === 'lookAtReviews' && <LookAtReviews />}
            {currentPage === 'help' && <Help />}
        </div>
    );
};

export default Main;