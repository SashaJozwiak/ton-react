import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";

const BackButton = WebApp.BackButton;
BackButton.onClick(() => window.history.back());

const Profile = ({ userId }) => {

    const [userAppData, setUserAppData] = useState({});

    console.log(userId)
    console.log(WebApp.initDataUnsafe)
    console.log(WebApp.initDataUnsafe.user)

    console.log('userAppData', userAppData);

    useEffect(() => {

        const fetchData = async () => {
            try {
                if (WebApp.initDataUnsafe.user) {
                    const getUserData = WebApp.initDataUnsafe.user;
                    setUserAppData(getUserData || {});
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
            <h1>Profile</h1>
        </div>
    )
}

export default Profile;
