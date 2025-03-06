import { AdjustmentsHorizontalIcon, ChevronDoubleDownIcon, ClockIcon, EllipsisVerticalIcon, FireIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
const Flame = FireIcon
const Clock = ClockIcon
const ChevronRight = ChevronDoubleDownIcon


import {
  List,
  ListItem,
  ListItemPrefix,
  Tooltip
} from "@material-tailwind/react";

import { Link } from 'react-router-dom';


const PlanCard = ({ plan, title, shortbrief, planranges, url, handleDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const image = "https://i.postimg.cc/cH3F5y3f/2419-Kachumber-Salad-Cucumber-Salad-result.webp";
  const calories = "650";
  const prepTime = "35 min";
  const rating = 4;

  return (
    <div
      className="w-80 h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full p-6 flex flex-col justify-between">
        <div className='absolute top-1 right-1 cursor-pointer ' onClick={() => setIsOpen(!isOpen)}>
          <EllipsisVerticalIcon color='white' height={30} width={30} />
        </div>
        {isOpen && (
          <div className="absolute z-10 bg-white shadow-md w-24 rounded-md p-2 top-1 right-7">
            <ListItem className="rounded-lg p-2 text-sm font-normal text-gray-900 hover:bg-gray-300 hover:text-gray-900 focus:bg-gray-100">
              <button onClick={() => handleDelete(plan._id)}>Delete</button>
            </ListItem>
            {/* Add more options here if needed */}
          </div>
        )}
        <div className="flex justify-center items-center w-48 h-48 max-h-48 overflow-hidden rounded-lg mb-2">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 ease-out rounded-lg"
            style={{
              backgroundImage: `url(${plan.images[0]})`,
              transform: isHovered ? 'scale(1.1)' : 'scale (1)'
            }}
          >
          </div>
        </div>

        <div>
          <h2 className="text-white font-bold text-2xl mb-1 leading-tight">{title}</h2>
          <div className="flex items-center space-x-2 mb-4">
            <Tooltip placement="bottom" content={planranges.map((range, index) => (<p key={index}>{range.calories}</p>))}>
              <h6 className="text-white font-bold text-sm leading-tight">Calorie ranges from</h6>
            </Tooltip>
            <div className="transform transition-transform duration-500 hover:scale-110 bg-gray-700 p-1 rounded-lg">
              <AdjustmentsHorizontalIcon color='white' height={20} width={20} />
            </div>
          </div>
          <div className="flex items-center text-gray-300 mb-2">
            <span>{shortbrief}</span>
          </div>
        </div>

        <div className="z-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white text-2xl font-bold">{calories} <span className="text-sm font-normal">cal</span></span>
            <Link to={url}>
              <button
                className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold flex items-center transition-all duration-300 hover:bg-opacity-90 hover:pr-6 group"
              >
                View
                <ChevronRight className="w-5 h-5 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
          <div
            className="w-full bg-gray-700 h-1 rounded-full overflow-hidden"
          >
            <div
              className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 h-full transition-all duration-500 ease-out"
              style={{ width: isHovered ? '100%' : '0%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;