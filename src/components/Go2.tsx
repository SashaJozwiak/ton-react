import React, { useState, useEffect } from 'react';
import { google } from 'googleapis';

const GoogleFitComponent = () => {
    const [steps, setSteps] = useState(null);

    useEffect(() => {
        // Функция для загрузки данных о шагах пользователя
        const getStepsData = async () => {
            // Авторизация пользователя
            const oauth2Client = new google.auth.OAuth2(
                '645228011309-5k6c1t23q8ibk25d2l5sqbimpmtsgiq4.apps.googleusercontent.com',
                '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',
                'http://localhost:5173/ton-react/'
            );

            const scopes = ['https://www.googleapis.com/auth/fitness.activity.read'];

            const authorizeUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes,
            });

            // Переход на страницу авторизации
            window.location.href = authorizeUrl;

            // Получение токена после авторизации
            const code = new URLSearchParams(window.location.search).get('code');
            const { tokens } = oauth2Client.getToken(code);

            oauth2Client.setCredentials(tokens);

            // Получение данных о шагах пользователя
            const fitness = google.fitness({ version: 'v1', auth: oauth2Client });

            const result = await fitness.users.dataSources.datasets.aggregate({
                userId: 'me',
                requestBody: {
                    aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
                    bucketByTime: { durationMillis: 86400000 },
                    startTimeMillis: Date.now() - 86400000,
                    endTimeMillis: Date.now(),
                },
            });

            const totalSteps = result.data.bucket[0].dataset[0].point[0].value[0].intVal;
            setSteps(totalSteps);
        };

        getStepsData();
    }, []);

    return (
        <div>
            <h1>Steps taken today: {steps}</h1>
        </div>
    );
};

export default GoogleFitComponent;
