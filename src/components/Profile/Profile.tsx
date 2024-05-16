import WebApp from "@twa-dev/sdk";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState } from "react";

import { TonConnectButton } from '@tonconnect/ui-react';
//import { useTonConnect } from '../../hooks/useTonConnect';

import loader from '../../assets/loading-gif.gif'


interface UserData {
    username: string | undefined;
}

const Profile = ({ userId, setRoutes }) => {
    //const { connected } = useTonConnect();

    const [userAppData, setUserAppData] = useState<UserData>({ username: undefined });

    console.log('userId', userId);
    console.log('userAppData', userAppData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (WebApp.initDataUnsafe.user) {
                    const getUserData = WebApp.initDataUnsafe.user;
                    setUserAppData({ username: getUserData.username });
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
            <h2>Hi, {userAppData?.username || <img src={loader} alt="loader" width='5%'></img>}</h2>

            <TonConnectButton />
        </div>
    )
}

export default Profile;
