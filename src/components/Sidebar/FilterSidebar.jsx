import { iconInfomation } from '../Map/mapIcons.js';
import './FilterSidebar.css';

function FilterSidebar({ activeTypes, setActiveTypes }) {
  const allKeys = Object.keys(iconInfomation);

  // Filter pin types
  const toggleAll = () => {
    if (activeTypes.length === Object.keys(iconInfomation).length) {
      setActiveTypes([]); // Clear all if everything is currently selected
    } else {
      setActiveTypes(Object.keys(iconInfomation))
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

        {allKeys.map((key) => {
          return (
            <button 
              key={key}
              className={activeTypes.includes(key) ? 'active' : ''}
              onClick={() => toggleType(key)}
              style={{ 
                borderLeft: `5px solid ${iconInfomation[key].color}`,
                opacity: activeTypes.includes(key) ? 1 : 0.6 
              }}
            >
              <i className={`fa-solid ${iconInfomation[key].icon}`} style={{ marginRight: '8px' }}></i>
              {iconInfomation[key].label}
            </button>
          )})}
      </div>
    </div>
  );
}

export default FilterSidebar;
