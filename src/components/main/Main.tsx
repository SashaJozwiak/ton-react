import { useEffect, useState } from 'react';
import { AuthData } from '../../App';
import { getActivities } from '../../utils/queries/fetchData';
import { ActivityData } from '../../utils/queries/fetchData';
import { refreshAccessToken } from '../../utils/queries/refreshAccessToken';

interface MainProps {
    userId: number;
    authData: AuthData | null;
}

export const Main: React.FC<MainProps> = ({ userId, authData }) => {
    const [activData, setActivData] = useState<ActivityData>({
        steps: 0,
        cardio: 0,
        calories: 0,
    });

    async function fetchDataFromGoogleFit(token: string) {
        try {
            const activity = await getActivities(token)
            setActivData(activity)
            console.log(activity)
        } catch (error) {
            console.error('Error fetching user data from Google Fit:', error);
        }
    }

    useEffect(() => {
        async function refressAcc() {
            await refreshAccessToken(authData!.refresh_token, userId)
        }

        if (authData !== null) {
            //console.log(authData.expiry_date)
            const unixExpire = new Date(authData.expiry_date).getTime();
            console.log(unixExpire)
            if (unixExpire - 300000 < Date.now()) {
                console.log('token expired');
                refressAcc();
            }

            fetchDataFromGoogleFit(authData.access_token)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <h1>Demo season</h1>
            <p style={{ marginBottom: '1em' }}>from April 1, 2024</p>
            <p>main_userId: {userId}</p>
            {!userId && <p>не получил userId</p>}

            {authData && <pre>bdId:{authData.id}</pre>}

            <div style={{ border: '1px solid grey', padding: '1em', width: '50' }}>
                <h1>Points: {((activData.steps + activData.calories + (activData.cardio * 100)) / 1000).toFixed(3) || 0}</h1>
            </div>

            <div style={{ float: "left", width: '50%' }}>
                <h3 style={{ textAlign: 'left' }}>Cardio: {activData.cardio && activData.cardio}</h3>
                <h3 style={{ textAlign: 'left' }}>Kcal: {activData.calories && activData.calories}</h3>
                <h3 style={{ textAlign: 'left' }}>Steps: {activData.steps && activData.steps}</h3>
            </div>
            <p>====</p>

        </div>
    )
}
