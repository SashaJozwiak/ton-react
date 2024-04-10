import { OAuth2Client } from "google-auth-library";
import axios from 'axios';

const setCustomUserAgent = (url: string, userAgent: string) => {
    return axios.get(url, {
        headers: {
            'User-Agent': userAgent
        }
    });
};

export const Auth = async (client: OAuth2Client): Promise<void> => {
    try {
        const url = client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/fitness.activity.read'
            //prompt: 'consent' // Добавляем параметр prompt со значением consent, чтобы пользователь мог выбрать разрешения
        })

        setCustomUserAgent(url, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
            .then(response => {
                // Обработка успешного ответа
                console.log(response.data);
            })
            .catch(error => {
                // Обработка ошибки
                console.log(error);
        });

        window.location.href = url;
    } catch (error) {
        console.log(error);
    }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSteps = async (token: any, setSteps: any) => {
    try {
        const response = await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources', {
            headers: {
                Authorization: `Bearer ${token.access_token}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
        });

        const startUnixTimestamp = 1711929600; // Unix timestamp для 1 апреля 2024 года
        const endUnixTimestamp = Math.floor(new Date().getTime() / 1000); // Текущее время в формате Unix timestamp

        const stepsResponse = await axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
            "aggregateBy": [{
                "dataTypeName": "com.google.step_count.delta",
                //"dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
            }],
            "bucketByTime": {
                "durationMillis": 86400000
            },
            "startTimeMillis": startUnixTimestamp * 1000, // 1 апреля 2024
            "endTimeMillis": endUnixTimestamp * 1000,
        }, {
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        console.log(stepsResponse.data)


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const totalSteps = stepsResponse.data.bucket.reduce((total: any, bucket: { dataset: { point: any[]; }[]; }) => {
            // Для каждой корзины с шагами, добавляем количество шагов к общей сумме
            return total + bucket.dataset[0].point.reduce((sum, point) => {
                // Суммируем значения шагов для каждого часа
                return sum + (point.value[0].intVal || 0); // Обрабатываем случай отсутствия значений
            }, 0);
        }, 0);


        console.log(totalSteps)
        const formattedNumber = new Intl.NumberFormat('en-US').format(totalSteps);
        console.log(formattedNumber)
        setSteps(formattedNumber);
        console.log('steps:', stepsResponse.data.bucket[0].dataset[0].point[0].value[0].intVal);

        console.log('User data from Google Fit:', response.data);

    } catch (error) {
        console.log(error);
    }
}
