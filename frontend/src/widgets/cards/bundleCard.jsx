import React, { useState } from 'react';
import { motion } from 'framer-motion';
// import { ChevronRight } from '@heroicons/react/24/outline';

const BundleCard = ({ bundle }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="max-w-4xl mx-auto bg-white border border-blue-gray-100 rounded-xl overflow-hidden flex flex-col sm:flex-row "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <div className="sm:w-1/2 p-4 sm:p-6 flex flex-col justify-between ">
                <div className='relative flex-grow'>
                    <svg className="absolute bottom-0 left-0 mb-8 w-full h-auto" viewBox="0 0 375 283" fill="none" style={{ transform: 'scale(1.5)', opacity: 0.1 }}>
                        <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="black" />
                        <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="black" />
                    </svg>
                    <div className="uppercase tracking-wide text-sm text-gray-900 to-gray-800-500 font-semibold "><h2 className='line-clamp-1'>{bundle.name}</h2></div>
                    <p className="mt-2 text-gray-500 text-sm sm:text-base line-clamp-2">
                        {bundle.remarks}
                    </p>
                </div>
                <div className="mt-4 flex items-center flex-wrap">
                    <span className="text-gray-600 mr-2 flex items-center text-sm">
                        {/* <Utensils className="w-4 h-4 mr-1" /> */}
                        21 meals included
                    </span>
                    <button
                        className="mt-2 sm:mt-0 w-full sm:w-auto inline-flex iems-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-br from-gray-900 to-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        More Details

                    </button>
                </div>
            </div >
            <div className="sm:w-1/2">
                <img
                    className="h-48 sm:h-full w-full object-cover"
                    defaultValue={"https://i.postimg.cc/cH3F5y3f/2419-Kachumber-Salad-Cucumber-Salad-result.webp"}
                    src={bundle.image}
                    alt="Meal Plan Bundle"
                />
            </div>
        </div >
    );
};

export default BundleCard;