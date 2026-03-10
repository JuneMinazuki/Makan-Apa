import { iconStyle } from '../Map/mapIcons.js';
import { LocationType } from '../../data/locations.js';
import './FilterSidebar.css';

function FilterSidebar({ activeTypes, setActiveTypes }) {
  const allKeys = Object.keys(iconStyle);

  // Filter pin types
  const toggleAll = () => {
    if (activeTypes.length === Object.keys(iconStyle).length) {
      setActiveTypes([]); // Clear all if everything is currently selected
    } else {
      setActiveTypes(Object.keys(iconStyle))
    }
  };

  const toggleType = (key) => {
    setActiveTypes(prev => 
      prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
    );
  };

  return (
    <div className="filter-sidebar">
      <h3>Category</h3>
      <div className="filter-group">
        <button 
          className={activeTypes.length === allKeys.length ? 'active' : ''} 
          onClick={toggleAll}
        >
          {activeTypes.length === allKeys.length ? 'Unselect All' : 'Select All'}
        </button>

        {allKeys.map((key) => (
          <button 
            key={key}
            className={activeTypes.includes(key) ? 'active' : ''}
            onClick={() => toggleType(key)}
            style={{ 
              borderLeft: `5px solid ${iconStyle[key].color}`,
              opacity: activeTypes.includes(key) ? 1 : 0.6 
            }}
          >
            <i className={`fa-solid ${iconStyle[key].icon}`} style={{ marginRight: '8px' }}></i>
            {LocationType[key]} 
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterSidebar;
