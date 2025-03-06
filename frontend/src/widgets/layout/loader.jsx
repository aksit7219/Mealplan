import React from 'react'
import { Spinner } from "@material-tailwind/react";
export function Loader() {
    return (
        <div className="flex items-center justify-center h-[80vh]">
            <Spinner />
        </div>
    );
}



export default Loader;
