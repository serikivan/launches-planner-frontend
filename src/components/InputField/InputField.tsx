import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../../slices/dataSlice';
import { RootState } from '../../store';
import './InputField.css';

interface Props {
    onSubmit: () => void;
    loading?: boolean;
    placeholder?: string;
    buttonTitle?: string;
}

const InputField: FC<Props> = ({ onSubmit, placeholder }) => {
    const dispatch = useDispatch();
    const searchValue = useSelector((state: RootState) => state.search.searchTerm);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSubmit();
        }
    };

    return (
        <div className="inputField">
            <input
                value={searchValue}
                placeholder={placeholder}
                onChange={(event) => dispatch(setSearchTerm(event.target.value))}
                onKeyPress={handleKeyPress}
            />
            <span className="searchIcon" onClick={onSubmit}>
            </span>
        </div>
    );
};

export default InputField;