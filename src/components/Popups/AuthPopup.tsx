//import React from 'react';;
import './AuthPopup.css';

const BlockingPopup = ({ isPopupOpen, userId }) => {
    return (
        <>
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        {/* Здесь добавьте содержимое вашего popup */}
                        <h2>Popup Content</h2>
                        <p>This is a blocking popup!</p>
                        <a href={`http://localhost:3000/auth?userId=${userId}`} target="_blank">Close</a>
                    </div>
                </div>
            )}
        </>
    );
};

export default BlockingPopup;
