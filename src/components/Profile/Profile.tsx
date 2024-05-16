import WebApp from "@twa-dev/sdk";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState } from "react";

import loader from '../../assets/loading-gif.gif'


interface UserData {
    username: string | undefined;
}

const Profile = ({ userId, setRoutes }) => {

    const [userAppData, setUserAppData] = useState<UserData>({ username: undefined });

    console.log(userId)
    console.log(WebApp.initDataUnsafe)
    console.log(WebApp.initDataUnsafe.user)

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
                //await fetchUserData();
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();

    }, [])

    return (
        <div>
            <BackButton onClick={() => setRoutes('main')} />
            <h1>Hi, {userAppData?.username || <img src={loader} alt="loader" width='5%'></img>}</h1>
        </div>
    )
}

export default Profile;
