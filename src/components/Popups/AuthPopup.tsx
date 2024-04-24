//import { useState } from 'react';
import './AuthPopup.css';

const BlockingPopup = ({ isPopupOpen, userId }) => {
    //const [ok, setOk] = useState<boolean>(false);

    return (
        <>
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <h1>Authorization</h1>
                        <h3>To authorize, you must have the Google Fit app installed on your Android or iPhone.</h3>

                        <a href={`http://localhost:3000/auth?userId=${userId}`} target="_blank">Close</a>
                    </div>
                </div>
            )}
        </>
    );
};

export default BlockingPopup;
