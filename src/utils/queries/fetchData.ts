/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';

export interface ActivityData {
    steps: number;
    cardio: number;
    calories: number;
}

export const getActivities = async (token: string): Promise<ActivityData> => {
    const startUnixTimestamp = 1717200001; //1 мая 2024 года 1711929601 change for season start
    const endUnixTimestamp = Math.floor(new Date().getTime() / 1000);

    try {
        const stepsResponse = await axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
            "aggregateBy": [{
                "dataTypeName": "com.google.step_count.delta",
            }],
            "bucketByTime": {
                "durationMillis": 86400000
            },
            "startTimeMillis": startUnixTimestamp * 1000, // 1 июня 2024
            "endTimeMillis": endUnixTimestamp * 1000,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        const cardioResponse = await axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
            "aggregateBy": [{
                "dataTypeName": "com.google.heart_minutes",
            }],
            "bucketByTime": {
                "durationMillis": 86400000
            },
            "startTimeMillis": startUnixTimestamp * 1000,
            "endTimeMillis": endUnixTimestamp * 1000,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        const caloriesResponse = await axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
            "aggregateBy": [{
                "dataTypeName": "com.google.calories.expended",
            }],
            "bucketByTime": {
                "durationMillis": 86400000
            },
            "startTimeMillis": startUnixTimestamp * 1000,
            "endTimeMillis": endUnixTimestamp * 1000,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        //filtering manual additions
        const excludedBuckets: number[] = [];

        const filteredSteps = stepsResponse.data.bucket.filter((item: any, index: number) => {
            const isUserInput = item.dataset[0].point[0]?.originDataSourceId.endsWith(':user_input');
            if (isUserInput) {
                excludedBuckets.push(index);
            }
            return !isUserInput;
        });

        const filteredCardio = cardioResponse.data.bucket.filter((_: any, index: number) => {
            return !excludedBuckets.includes(index);
        });

        const filteredCalories = caloriesResponse.data.bucket.filter((_: any, index: number) => {
            return !excludedBuckets.includes(index);
        });

        console.log('excludedBuckets', excludedBuckets);
        console.log('filteredSteps: ', filteredSteps);
        console.log('filteredCardio: ', filteredCardio);
        console.log('filteredCalories: ', filteredCalories);

        //sums after filtering handling adds
        const sumSteps = filteredSteps.reduce((total: any, bucket: any) => {
            return total + bucket.dataset.reduce((datasetTotal: any, dataset: any) => {
                return datasetTotal + dataset.point.reduce((pointTotal: any, point: any) => {
                    return pointTotal + (point.value[0].intVal || 0);
                }, 0);
            }, 0);
        }, 0);

        const sumCardio = filteredCardio.reduce((total: any, bucket: any) => {
            return total + bucket.dataset.reduce((datasetTotal: any, dataset: any) => {
                return datasetTotal + dataset.point.reduce((pointTotal: any, point: any) => {
                    return pointTotal + (point.value[0].fpVal || 0);
                }, 0);
            }, 0);
        }, 0);

        const sumCalories = filteredCalories.reduce((total: any, bucket: any) => {
            return total + bucket.dataset.reduce((datasetTotal: any, dataset: any) => {
                return datasetTotal + dataset.point.reduce((pointTotal: any, point: any) => {
                    return pointTotal + point.value[0].fpVal || 0;
                }, 0);
            }, 0);
        }, 0);

        const activityData: ActivityData = {
            steps: sumSteps,
            cardio: sumCardio,
            calories: +sumCalories.toFixed(),
        };
        return activityData;
    } catch (error) {
        console.error('Error fetching activity data:', error);
        throw error;
    }
};
