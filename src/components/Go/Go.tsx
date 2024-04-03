import React from 'react';
import { Credentials, OAuth2Client } from 'google-auth-library';
import axios from 'axios';

import copy from 'copy-to-clipboard';

export const Go = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [, setAccessToken] = React.useState<Credentials | null>(null);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [steps, setSteps] = React.useState(0);

    const [yourStateObject, setYourStateObject] = React.useState({});

    const [onChageState, setOnChangeState] = React.useState('');

    const handleOnChange = () => {
        const parsedObject = JSON.parse(onChageState);
        setYourStateObject(parsedObject)
        setAccessToken(parsedObject);
        localStorage.setItem('accessToken', JSON.stringify(parsedObject));
        fetchDataFromGoogleFit(parsedObject);
        window.history.replaceState({}, document.title, window.location.pathname);
        setIsLoggedIn(true);
    }

    const copyObjectToClipboard = () => {
        // Здесь вы получаете ваш объект из состояния
        const objectToCopy = yourStateObject;

        // Преобразуйте объект в строку JSON
        const jsonString = JSON.stringify(objectToCopy);

        // Копируем строку JSON в буфер обмена
        copy(jsonString);

        // Можно добавить обратную связь для пользователя
        alert('Объект скопирован в буфер обмена!');
    };

    const client = new OAuth2Client({
        clientId: '645228011309-5k6c1t23q8ibk25d2l5sqbimpmtsgiq4.apps.googleusercontent.com',
        clientSecret: import.meta.env.VITE_SECRET_KEY,
        redirectUri: 'https://sashajozwiak.github.io/ton-react/'
    });

    localStorage.setItem('test', 'test');

    async function fetchDataFromGoogleFit(token: Credentials) {
        try {
            const response = await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources/watch', {
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                },
            });
            // Установка временных интервалов для запроса данных о шагах
            const start = new Date().setHours(0, 0, 0, 0);
            const end = new Date().getTime();

            // Вывод временных интервалов для отладки
            console.log({
                start: new Date(start).toLocaleString(),
                startMillis: start,
                end: new Date(end).toLocaleString(),
                endMillis: end
            });
            const stepsResponse = await axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
                "aggregateBy": [{
                    "dataTypeName": "com.google.step_count.delta",
                    //"dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
                }],
                "bucketByTime": {
                    "durationMillis": 86400000
                },
                "startTimeMillis": start,
                "endTimeMillis": end,
            }, {
                headers: {
                    'Authorization': `Bearer ${token.access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(stepsResponse.data)
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
                scope: 'https://www.googleapis.com/auth/fitness.activity.read',
                prompt: 'consent' // Добавляем параметр prompt со значением consent, чтобы пользователь мог выбрать разрешения
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

    async function refreshToken(refreshToken: string) {
        console.log(refreshToken)
        try {
            const requestBody = {
                client_id: '645228011309-5k6c1t23q8ibk25d2l5sqbimpmtsgiq4.apps.googleusercontent.com',
                client_secret: import.meta.env.VITE_SECRET_KEY,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            };

            // Отправляем POST запрос к серверу авторизации
            const response = await axios.post('https://oauth2.googleapis.com/token', requestBody);

            // Обрабатываем ответ и обновляем данные о токене
            const newAccessToken: Credentials = {
                access_token: response.data.access_token,
                refresh_token: refreshToken,
                // Обновляем другие поля токена при необходимости
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


    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        console.log(code);

        if (code) {
            client.getToken(code)
                .then((response) => {
                    //console.log('Token:', response);
                    setYourStateObject(response.tokens)

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
                const parsedToken = JSON.parse(storedToken);
                console.log(parsedToken, Date.now())
                if (parsedToken.expiry_date > Date.now()) {
                    setAccessToken(parsedToken);
                    fetchDataFromGoogleFit(parsedToken);
                    setIsLoggedIn(true);
                } else {
                    //вот здесь refresh токен, надо с помощью него изменить access токен на актуальный 
                    console.log(parsedToken.refresh_token)
                    refreshToken(parsedToken.refresh_token)
                }
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

            <button onClick={copyObjectToClipboard}>Скопировать объект</button>

            <input type="text" value={onChageState}
                placeholder="Enter key" onChange={(e) => setOnChangeState(e.target.value)} />
            <input type="button" value='Apply' onClick={handleOnChange} />

        </>
    );
};
