import { FC } from 'react';
import './InputField.css';
import { FaSearch } from 'react-icons/fa';

interface Props {
    loading?: boolean;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch?: () => void;
}

const InputField: FC<Props> = ({ loading, placeholder, value, onChange, onSearch }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
            e.preventDefault();
            onSearch();
        }
    };

    return (
        <div className="inputField">
            <input
                type="text"
                value={value || ''}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={loading}
            />
            <button 
                className="searchButton" 
                onClick={onSearch}
                disabled={loading}
                type="button"
            >
                <FaSearch className="searchIcon" />
            </button>
        </div>
    );
};

export { InputField };
export default InputField;