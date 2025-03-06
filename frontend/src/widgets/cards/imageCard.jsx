import React from 'react';
const ImageCard = ({ ImageUrl }) => {
    return (
        <div className="flex justify-center items-center space-x-4 bg-transparent p-6">
            <div className="w-48 h-48 border-2 border-orange-500 border-dashed rounded-lg flex items-center justify-center">
                <div className="w-40 h-40 bg-transparent rounded-lg overflow-hidden">
                    <img
                        src={ImageUrl || "https://i.postimg.cc/cH3F5y3f/2419-Kachumber-Salad-Cucumber-Salad-result.webp"}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageCard;