import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

const RecipeCard = ({ bgColor, imageSrc, label, title, price, textColor, handelOpen }) => (
  <div className="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
    <div className={`flex flex-col h-full overflow-hidden ${bgColor} rounded-lg shadow-lg`}>
      <div className="relative flex-grow">
        <svg className="absolute bottom-0 left-0 mb-8 w-full h-auto" viewBox="0 0 375 283" fill="none" style={{ transform: 'scale(1.5)', opacity: 0.1 }}>
          <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="white" />
          <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="white" />
        </svg>
        <div className="relative pt-10 px-6 sm:px-10 flex items-center justify-center">
          <div className="absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3" style={{ background: 'radial-gradient(black, transparent 60%)', transform: 'rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)', opacity: 0.2 }}></div>
          <img className="w-32 h-36 sm:w-40 sm:h-46 md:w-48 md:h-54 lg:w-[160px] lg:h-[183px] object-cover" src={imageSrc} alt={title} />
        </div>
      </div>
      <div className={`relative text-white px-4 sm:px-6 pb-6 mt-6 `}>
        <span className="block opacity-75 -mb-1 text-sm sm:text-base">{label}</span>
        <div className="flex flex-col items-start">
          <span className="block font-semibold text-lg sm:text-xl mb-2">{title}</span>
          <div className="flex flex-row items-start w-full justify-between">
            <span className={`block bg-white rounded-full ${textColor} text-xs font-bold px-3 py-2 leading-none flex items-center`}>${price}</span>
            <div className="flex flex-ro gap-6">
              <button onClick={handelOpen}><PencilSquareIcon className="w-6 h-6" /></button>
              <button><TrashIcon className="w-6 h-6" /> </button>
            </div>


          </div>
        </div>

      </div>
    </div>
  </div>
);

export default RecipeCard;
