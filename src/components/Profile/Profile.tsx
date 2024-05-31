import WebApp from "@twa-dev/sdk";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState } from "react";

import { TonConnectButton } from '@tonconnect/ui-react';
//import { useTonConnect } from '../../hooks/useTonConnect';

import loader from '../../assets/loading-gif.gif'

interface UserData {
    username: string | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
}

const Profile = ({ userId, setRoutes }) => {
    //const { connected } = useTonConnect();

    const [userAppData, setUserAppData] = useState<UserData>({ username: undefined, first_name: undefined, last_name: undefined });

    const [link, setLink] = useState<string>('https://t.me/zwiak');
    const [copied, setCopied] = useState<boolean>(false);


    console.log('userId', userId);
    console.log('userAppData', userAppData);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true)
        }).catch(err => {
            setCopied(false)
            console.error('Error copying link', err);
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (WebApp.initDataUnsafe.user) {
                    const getUserData = WebApp.initDataUnsafe.user;
                    console.log('userData', getUserData);
                    setUserAppData({ username: getUserData.username, first_name: getUserData.first_name, last_name: getUserData.last_name });
                } else {
                    console.log('not init');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData();
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <BackButton onClick={() => setRoutes('main')} />
            <h2>Hi, {userAppData?.first_name || userAppData?.last_name || userAppData?.username || <img src={loader} alt="loader" width='5%'></img>}</h2>

            <TonConnectButton />
            <div style={{ marginTop: '1em', display: 'flex', flexDirection: 'column' }}>
                <h2 >Invite friends</h2>
                <input
                    type="text"
                    readOnly={true}
                    style={{ margin: '0.4rem', border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: '0.25rem', padding: '0.5rem 0.3rem', width: '60vw', textAlign: 'center', background: 'lightgray' }}
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                <button onClick={handleCopyClick}
                    style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0rem 0.5rem', height: '2rem', fontSize: '1rem', color: 'white' }}
                >Copy Link{copied && ' ✅'}</button>
            </div>
        </div>
    )
}

export default Profile;
