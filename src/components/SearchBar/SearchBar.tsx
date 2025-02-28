import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { setSearchValue, getSatellitesList } from '../../slices/satellitesSlice';
import InputField from '../InputField/InputField';

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Поиск спутников...' }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { satellite_title, loading } = useSelector((state: RootState) => state.satellites);
  
  // Локальное состояние для контролируемого ввода
  const [localSearchValue, setLocalSearchValue] = useState(satellite_title);
  
  // Синхронизируем локальное состояние с Redux при изменении satellite_title извне
  useEffect(() => {
    setLocalSearchValue(satellite_title);
  }, [satellite_title]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchValue(e.target.value);
  };
  
  const handleSearch = () => {
    // Обновляем значение в Redux
    dispatch(setSearchValue(localSearchValue));
    // Запускаем поиск
    dispatch(getSatellitesList());
  };
  
  return (
    <InputField
      value={localSearchValue}
      onChange={handleSearchChange}
      onSearch={handleSearch}
      placeholder={placeholder}
      loading={loading}
    />
  );
};

export default SearchBar; 