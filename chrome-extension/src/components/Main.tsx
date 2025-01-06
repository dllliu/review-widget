import React, { useState, useEffect } from 'react';
import DropdownMenu from './Dropdown.tsx';
import Home from "./Home.tsx"
import Help from "./Help.tsx"
import LeaveReview from "./LeaveReview.tsx"
import LookAtReviews from "./LookAtReviews.tsx"
import axios from 'axios';

interface Product {
    title: string;
    description: string;
}

const postUrl = async (url: string): Promise<Product> => { // Define the return type of postUrl
    try {
        const response = await axios.post('http://localhost:5000/process_product', { url });
        // Assert the type of the response data
        return response.data as Product; // Explicitly cast response.data to ProductData
    } catch (error) {
        console.error('Error posting URL:', error);
        return { title: '', description: '' }; // Return empty object in case of an error
    }
};

const Main: React.FC = () => {
    const [_productData, setProductData] = useState<Product>({ title: '', description: '' }); // Change state to store the object
    const [currentPage, setCurrentPage] = useState<string>('home');
    const product: Product = {
        title: 'Laptop',
        description: 'A high performance laptop.',
    };

    useEffect(() => {
        const currentUrl = window.location.href;

        const fetchData = async () => {
            const data = await postUrl(currentUrl); // Fetch the product data using the current URL
            setProductData(data); // Set the product data after receiving the response
        };

        fetchData(); // Fetch data when component mounts
    }, []); // Empty dependency array to run once when the component mounts

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
            {currentPage === 'home' && <Home product={product} />}
            {currentPage === 'leaveReview' && <LeaveReview />}
            {currentPage === 'lookAtReviews' && <LookAtReviews />}
            {currentPage === 'help' && <Help />}
        </div>
    );
};

export default Main;