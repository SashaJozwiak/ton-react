
import { useState } from 'react';
import './AuthPopup.css';

const BlockingPopup = ({ isPopupOpen, userId }) => {

    const [ok, setOk] = useState(false);
    console.log(ok)
    return (
        <>
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <h1>Authorization</h1>
                        <p style={{ fontSize: '1rem', fontFamily: 'sans-serif', margin: '0.5rem 0', lineHeight: '1.5rem' }}>
                            You must have installed the <span style={{ fontWeight: 'bold' }}>Google Fit</span> app for <a style={{ textDecoration: 'none', border: '1px solid rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0.1rem', color: 'rgb(14, 165, 233)' }} href='https://apps.apple.com/ru/app/google-fit-activity-tracker/id1433864494' target="_blank">iPhone</a> or <a style={{ textDecoration: 'none', border: '1px solid rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0.1rem', color: 'rgb(14, 165, 233)' }} href='https://play.google.com/store/apps/details?id=com.google.android.apps.fitness' target="_blank">Android</a>.
                        </p>

                        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
                            <input style={{ display: 'inline-block', margin: '1rem 0.4rem', transform: 'scale(1.3)' }} id="ok" name='ok' type='checkbox' checked={ok} onChange={(e) => setOk(e.target.checked)} />
                            <label style={{ fontSize: '0.85rem', }} htmlFor="ok">Google Fit installed and logged</label>
                        </div>
                        <a href={`https://www.fitton.online/auth?userId=${userId}`} target="_blank"
                            style={{ position: 'relative', margin: '1rem auto', textDecoration: 'none', border: '1px solid rgb(14, 165, 233)', borderRadius: '0.25rem', cursor: 'pointer', padding: '0.5rem', fontSize: '1rem', fontWeight: 'bold', color: !ok ? 'rgba(14, 165, 233, 0.4)' : 'rgb(14, 165, 233)', pointerEvents: !ok ? 'none' : 'auto' }}
                        >Log In</a>
                    </div>
                </div>
            )}
        </>
    );
};

export default BlockingPopup;
