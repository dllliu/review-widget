import { useState, useEffect, useRef } from 'react';
import { findProductsByUrl, } from "../helpers/database";
import axios from 'axios';

// Define the response data structure type
interface ProductData {
    title: string;
    description: string;
}

const postUrl = async (url: string): Promise<ProductData> => { // Define the return type of postUrl
    try {
        const response = await axios.post('http://localhost:5000/process_product', { url });
        // Assert the type of the response data
        return response.data as ProductData; // Explicitly cast response.data to ProductData
    } catch (error) {
        console.error('Error posting URL:', error);
        return { title: '', description: '' }; // Return empty object in case of an error
    }
};

const Home: React.FC = () => {
    const [question, setQuestion] = useState<string>('');
    const [productData, setProductData] = useState<ProductData>({ title: '', description: '' }); // Change state to store the object
    const [loading, setLoading] = useState<boolean>(true);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const currentUrl = window.location.href;

        const fetchData = async () => {
            const data = await postUrl(currentUrl); // Fetch the product data using the current URL
            setProductData(data); // Set the product data after receiving the response
            setLoading(false); // Set loading to false after data is fetched
        };

        fetchData(); // Fetch data when component mounts
    }, []); // Empty dependency array to run once when the component mounts

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setQuestion(e.target.value);
    };

    // Resize the textarea based on the content height
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height to auto
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust to scrollHeight
        }
    }, [question]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log("Submitted question:", question);
        setQuestion('');
    };

    return (
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-96 relative max-h-screen overflow-y-auto" style={{ minHeight: '450px' }}>
            {/* Header with logo and help button */}
            <div className="flex justify-between items-center mb-4">
                <img src="/icons/logoGenie-48.png" alt="Logo" className="w-8 h-8" />
                <button className="text-gray-600 hover:text-gray-800 text-2xl">⋮</button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col bg-[rgba(43,181,172,0.38)] border rounded-[20px] mb-4 relative">
                <textarea
                    ref={textareaRef}
                    placeholder="What shall the genie let you know..."
                    value={question}
                    onChange={handleInputChange}
                    className="flex-grow p-2 bg-[rgba(43,181,172,0.38)] border-none focus:outline-none focus:ring-0 text-black placeholder-gray-500 resize-none box-border"
                    rows={1}
                />
                <button
                    type="submit"
                    className="absolute bottom-2 right-2 bg-transparent text-black text-2xl font-bold w-8 h-8 flex justify-center items-center rounded-full hover:bg-blue-200">
                    +
                </button>
            </form>

            <hr className="border-t-2 border-black my-4" />

            {/* Conditionally render product data */}
            {loading ? (
                <p className="text-gray-500 mt-2">Loading product data...</p>
            ) : (
                <div>
                    <h2 className="text-xl font-semibold">{productData.title}</h2>
                    <h3 className="font-medium mt-2">Description:</h3>
                    <p className="mt-1">{productData.description}</p>
                </div>
            )}
        </div>
    );
};

export default Home;