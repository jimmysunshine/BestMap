 'use client';

import { Input } from 'antd';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (address: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10 w-[300px]">
      <Input.Search
        placeholder="输入地址搜索"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSearch={handleSearch}
        enterButton
      />
    </div>
  );
};

export default SearchBar;