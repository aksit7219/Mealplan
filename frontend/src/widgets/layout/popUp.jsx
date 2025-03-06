import Button from '@/widgets/layout/button';
import { identity } from 'lodash';
const PopupForm = ({ isOpen, togglePopup, children }) => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg max-w-md w-full">
                        <span onClick={togglePopup} className="absolute top-2 right-2 cursor-pointer text-gray-600">
                            &times;
                        </span>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PopupForm;