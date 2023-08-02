import FilterDropdownStyles from './FilterDropdown.module.css'
import { useEffect, useRef } from 'react'

export default function FilterDropdown({setSelectedFilter, setShowFilterDropdown}){

    const selectOption = (idx) =>{
        setShowFilterDropdown(false)
        setSelectedFilter(idx)
    }


    const dropdownRef = useRef(null);

  useEffect(() => {
        const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            // Clicked outside the dropdown, so close it
            setShowFilterDropdown(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div className={FilterDropdownStyles.DropdownContainer} ref={dropdownRef}>
            <div className={FilterDropdownStyles.DropdownItem} onClick={() =>{selectOption(0)}}>
                Last Edit
            </div>
            <div className={FilterDropdownStyles.DropdownItem} onClick={() =>{selectOption(1)}}>
                Title [a-z]
            </div>
            <div className={FilterDropdownStyles.DropdownItem} onClick={() =>{selectOption(2)}}>
                Title [z-a]
            </div>
        </div>
    )
}