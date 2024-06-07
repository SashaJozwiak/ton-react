import { ActivityData } from "./fetchData";

export const postOnlifeBalance = async (userId: number, activData: ActivityData, sumPoints: number) => {

    try {
        const response = await fetch('https://fitton.online/onLifeAndSumBalance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, activData, sumPoints }),
        });
        const result = await response.json();
        //console.log(result);
        return result;
    } catch (e) {
        console.log('fetch teams errror: ', e);
    }
}
