import ReactDOM from 'react-dom';
import './StatusPopup.css';

const StatusPopup = ({ loading, error }) => {
  if (!loading && !error) return null;

  return ReactDOM.createPortal(
    <div className="status-popup-container">
      {loading && (
        <div className="status-popup loading">
          <i className="fas fa-spinner fa-spin"></i> Locating...
        </div>
      )}
      
      {error && (
        <div className="status-popup error" title={error}>
          <i className="fas fa-exclamation-circle"></i> Error: {error}
        </div>
      )}
    </div>,
    document.body
  );
};

export default StatusPopup;