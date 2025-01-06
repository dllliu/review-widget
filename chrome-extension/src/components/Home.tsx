import { useState, useEffect, useRef } from 'react';

interface Product {
    title: string;
    description: string;
}


interface HomeProps {
    product: Product;
}


const Home: React.FC<HomeProps> = ({ product }) => {
    const [question, setQuestion] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);


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
        <div>
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
                <div>
                    <h2 className="text-xl font-semibold">{product.title}</h2>
                    <h3 className="font-medium mt-2">Description:</h3>
                    <p className="mt-1">{product.description}</p>
                </div>
        </div>
    );
};

export default Home;