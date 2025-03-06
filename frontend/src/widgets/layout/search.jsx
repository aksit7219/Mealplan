import React, { useState } from 'react';
import { Input } from '@material-tailwind/react';

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="mr-auto md:mr-4 md:w-56">
      <Input
        label="Search"
        value={onSearch}
        onChange={handleChange}
        className="border border-gray-300 rounded-md p-2"
      />
    </div>
  );
};

export default Search;
