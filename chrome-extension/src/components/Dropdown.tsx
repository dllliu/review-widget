import React, { useState } from 'react';

interface DropdownMenuProps {
    onPageChange: (page: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ onPageChange }) => {
    // State to keep track of selected option
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    return (
        <div className="relative inline-block">
            {/* Main Button */}
            <button className="text-gray-600 hover:text-gray-800 text-2xl" onClick={toggleDropdown} >⋮</button>
            {/* Dropdown Content */}
            {isDropdownVisible && (
                <div className="absolute mt-2 w-48 bg-gray-100 rounded-md shadow-lg right-0 top-full z-50" onClick={toggleDropdown}>
                    <button
                        className="block w-full px-4 py-2 text-left text-black bg-gray-100 hover:bg-gray-200 focus:outline-none"
                        onClick={() => onPageChange('home')}
                    >
                        Home
                    </button>
                    <button
                        className="block w-full px-4 py-2 text-left text-black bg-gray-100 hover:bg-gray-200 focus:outline-none"
                        onClick={() => onPageChange('leaveReview')}
                    >
                        Leave a Review
                    </button>
                    <button
                        className="block w-full px-4 py-2 text-left text-black bg-gray-100 hover:bg-gray-200 focus:outline-none"
                        onClick={() => onPageChange('lookAtReviews')}
                    >
                        Look at Reviews
                    </button>
                    <button
                        className="block w-full px-4 py-2 text-left text-black bg-gray-100 hover:bg-gray-200 focus:outline-none"
                        onClick={() => onPageChange('help')}
                    >
                        Help
                    </button>

                </div>
            )}
        </div>
    );
};

export default DropdownMenu;