import React from 'react'
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

export const Go = () => {
    const [accessToken, setAccessToken] = React.useState({});

    const client = new OAuth2Client({
        clientId: '645228011309-5k6c1t23q8ibk25d2l5sqbimpmtsgiq4.apps.googleusercontent.com',
        clientSecret: import.meta.env.VITE_SECRET_KEY,
        redirectUri: 'https://sashajozwiak.github.io/ton-react/' //change
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function fetchDataFromGoogleFit(token: any) {
        try {
            const response = await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources', {
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                },
            });

            const steps = await axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                {
                    "aggregateBy": [{
                        "dataTypeName": "com.google.step_count.delta",
                        //"dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
                    }],
                    "bucketByTime": {
                        "durationMillis": 86400000 // 1 день в миллисекундах
                    },
                    "startTimeMillis": new Date().setHours(0, 0, 0, 0), // начало текущего дня
                    "endTimeMillis": new Date().getTime() // текущее время
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token.access_token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            console.log('steps:', steps.data);

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

            window.location.href = url;
        } catch (error) {
            console.log(error);
        }

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
                })
                .catch((error) => console.error('Error:', error));

        } else if (urlParams.has('error')) {
            console.error('Authorization error:', urlParams.get('error'));

        } else {
            const storedToken = localStorage.getItem('accessToken');
            if (storedToken) {
                setAccessToken(JSON.parse(storedToken));
                fetchDataFromGoogleFit(JSON.parse(storedToken));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div>Go</div>
            <button onClick={handleLogin}>Login with Google</button>

        </>
    )
}
