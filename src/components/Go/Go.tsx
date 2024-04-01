import React from 'react';
import { Credentials, OAuth2Client } from 'google-auth-library';
import axios from 'axios';

export const Go = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [, setAccessToken] = React.useState<Credentials | null>(null);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [steps, setSteps] = React.useState(0);

    const client = new OAuth2Client({
        clientId: '645228011309-5k6c1t23q8ibk25d2l5sqbimpmtsgiq4.apps.googleusercontent.com',
        clientSecret: import.meta.env.VITE_SECRET_KEY,
        redirectUri: 'https://t.me/ton_react_bot/ton_react'
    });

    async function fetchDataFromGoogleFit(token: Credentials) {
        try {
            const response = await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources', {
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                },
            });

            const stepsResponse = await axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
                "aggregateBy": [{
                    "dataTypeName": "com.google.step_count.delta",
                    "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
                }],
                "bucketByTime": {
                    "durationMillis": 86400000
                },
                "startTimeMillis": new Date().setHours(0, 0, 0, 0),
                "endTimeMillis": new Date().getTime()
            }, {
                headers: {
                    'Authorization': `Bearer ${token.access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('steps:', stepsResponse.data.bucket[0].dataset[0].point[0].value[0].intVal);
            setSteps(stepsResponse.data.bucket[0].dataset[0].point[0].value[0].intVal);
            console.log('User data from Google Fit:', response.data);
        } catch (error) {
            console.error('Error fetching user data from Google Fit:', error);
        }
    }

    async function handleLogin() {
        try {
            const url = client.generateAuthUrl({
                access_type: 'offline',
                scope: 'https://www.googleapis.com/auth/fitness.activity.read'
            });
            window.open(url, '_blank');
        } catch (error) {
            console.log(error);
        }
    }

    function handleLogout() {
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        setIsLoggedIn(false);
        setSteps(0);
    }

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            client.getToken(code)
                .then((response) => {
                    console.log('Token:', response);
                    setAccessToken(response.tokens);
                    localStorage.setItem('accessToken', JSON.stringify(response.tokens));
                    fetchDataFromGoogleFit(response.tokens);
                    window.history.replaceState({}, document.title, window.location.pathname);
                    setIsLoggedIn(true);
                })
                .catch((error) => console.error('Error:', error));
        } else {
            const storedToken = localStorage.getItem('accessToken');
            if (storedToken) {
                setAccessToken(JSON.parse(storedToken));
                fetchDataFromGoogleFit(JSON.parse(storedToken));
                setIsLoggedIn(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div>{steps}</div>
            <div>state: {isLoggedIn.toString()}</div>
            {isLoggedIn ? (
                <button onClick={handleLogout}>Log out</button>
            ) : (
                <button onClick={handleLogin}>Login with Google</button>
            )}
        </>
    );
};
