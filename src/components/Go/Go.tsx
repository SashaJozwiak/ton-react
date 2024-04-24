import React from 'react';
import { Credentials, OAuth2Client } from 'google-auth-library';
import axios from 'axios';

import copy from 'copy-to-clipboard';
import { Auth, getSteps } from './goUtils';

export const Go = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [, setAccessToken] = React.useState<Credentials | null>(null); //AccessToken
    const [isLoggedIn, setIsLoggedIn] = React.useState(false); //logged?
    const [steps, setSteps] = React.useState(''); // steps count

    const [yourStateObject, setYourStateObject] = React.useState({}); //AccessToken + RefreshToken, full obj
    const [onChageState, setOnChangeState] = React.useState(''); //Input AccessToken + RefreshToken, full obj

    const [someData, setSomeData] = React.useState({});
    const [someData2, setSomeData2] = React.useState({});

    const handleOnChange = () => {
        const parsedObject = JSON.parse(onChageState);
        setYourStateObject(parsedObject)
        setAccessToken(parsedObject);
        localStorage.setItem('accessToken', JSON.stringify(parsedObject));
        fetchDataFromGoogleFit(parsedObject);
        //window.history.replaceState({}, document.title, window.location.pathname);
        setIsLoggedIn(true);
    }
    //test
    const copyObjectToClipboard = () => {
        const objectToCopy = yourStateObject;
        const jsonString = JSON.stringify(objectToCopy);
        copy(jsonString);
        alert('Объект скопирован в буфер обмена!');
    };

    const client = new OAuth2Client({
        clientId: '645228011309-5k6c1t23q8ibk25d2l5sqbimpmtsgiq4.apps.googleusercontent.com',
        clientSecret: import.meta.env.VITE_SECRET_KEY,
        redirectUri: 'https://t.me/ton_react_bot/ton_react'
    });

    async function fetchDataFromGoogleFit(token: Credentials) {
        try {
            getSteps(token, setSteps);
        } catch (error) {
            console.error('Error fetching user data from Google Fit:', error);
        }
    }

    /* async function handleLogin() {
        try {
            const url = client.generateAuthUrl({
                access_type: 'offline',
                scope: 'https://www.googleapis.com/auth/fitness.activity.read'
                //prompt: 'consent' // Добавляем параметр prompt со значением consent, чтобы пользователь мог выбрать разрешения
            });
            window.open(url, '_blank');
        } catch (error) {
            console.log(error);
        }
    } */

    function handleLogout() {
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        setIsLoggedIn(false);
        setSteps('0');
    }

    async function refreshToken(refreshToken: string) {
        console.log(refreshToken)
        try {
            const requestBody = {
                client_id: '645228011309-5k6c1t23q8ibk25d2l5sqbimpmtsgiq4.apps.googleusercontent.com',
                client_secret: import.meta.env.VITE_SECRET_KEY,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            };

            const response = await axios.post('https://oauth2.googleapis.com/token', requestBody);

            const newAccessToken: Credentials = {
                access_token: response.data.access_token,
                refresh_token: refreshToken,
            };

            console.log(newAccessToken)
            setAccessToken(newAccessToken);

            localStorage.setItem('accessToken', JSON.stringify(newAccessToken));
            setIsLoggedIn(true);
            fetchDataFromGoogleFit(newAccessToken);
        } catch (error) {
            console.error('Error refreshing token:', error);
            alert('Ошибка при обновлении токена доступа. Пожалуйста, повторите попытку позже.');
        }
    }

    const url = window.location.href

    console.log(url)
    //console.log(window.Telegram.WebApp.cloudStorage)
    //console.log('userAgent', window.navigator.userAgent)


    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        console.log(code);

        if (code) {
            client.getToken(code)
                .then((response) => {
                    setYourStateObject(response.tokens)

                    setAccessToken(response.tokens);
                    localStorage.setItem('accessToken', JSON.stringify(response.tokens));

                    fetchDataFromGoogleFit(response.tokens);
                    //window.history.replaceState({}, document.title, window.location.pathname);
                    setIsLoggedIn(true);
                })
                .catch((error) => console.error('Error:', error));
        } else {
            const storedToken = localStorage.getItem('accessToken');
            if (storedToken) {
                const parsedToken = JSON.parse(storedToken);
                console.log(parsedToken, Date.now())
                if (parsedToken.expiry_date > Date.now()) {
                    setAccessToken(parsedToken);
                    fetchDataFromGoogleFit(parsedToken);
                    setIsLoggedIn(true);
                } else {
                    console.log(parsedToken.refresh_token)
                    refreshToken(parsedToken.refresh_token)
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps


        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3210/data');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setSomeData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchData2 = async () => {
            try {
                const response = await fetch('http://localhost:3000/data');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setSomeData2(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        fetchData2();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {isLoggedIn ? (
                <button onClick={handleLogout}>Log out</button>
            ) : (
                    <button onClick={() => Auth(client)}>Login with Google</button>
            )}

            <button onClick={copyObjectToClipboard}>Скопировать объект</button>

            <input type="text" value={onChageState}
                placeholder="Enter key" onChange={(e) => setOnChangeState(e.target.value)} />
            <input type="button" value='Apply' onClick={handleOnChange} />
            <h2 style={{ margin: '5px auto' }}>From 1 april:</h2 >
            <div>steps: {steps}</div>
            <div>state: {isLoggedIn.toString()}</div>

            <div>
                <h1>Data from Server:</h1>
                {someData ? (
                    <pre>{JSON.stringify(someData, null, 2)}</pre>
                ) : (
                    <p>Loading...</p>
                )}
                {someData2 ? (
                    <pre>{JSON.stringify(someData2, null, 2)}</pre>
                ) : <p>Loading...</p>}
            </div>

        </>
    );
};
