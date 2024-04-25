import { useEffect, useState } from 'react';
import { AuthData } from '../../App';
import { getActivities } from '../../utils/queries/fetchData';
import { ActivityData } from '../../utils/queries/fetchData';
import { refreshAccessToken } from '../../utils/queries/refreshAccessToken';
import { lvls } from '../../utils/math/lvls';

import './Main.css';
import { calculateLvl, sumPointsFn } from '../../utils/math/points';

interface MainProps {
    userId: number;
    setUserId: (userId: number) => void;
    authData: AuthData | null;
}

export interface IProgress {
    current_lvl: number,
    current_points: number,
    start_lvl: number,
    next_lvl: number,
}



export const Main: React.FC<MainProps> = ({ userId, setUserId, authData }) => {
    const [activData, setActivData] = useState<ActivityData>({
        steps: 0,
        cardio: 0,
        calories: 0,
    });
    const [sumPoints, setSumPoints] = useState<number>(0);
    const [progress, setProgress] = useState<IProgress>({
        current_lvl: 0,
        current_points: 0,
        start_lvl: 0,
        next_lvl: 0,
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
                setUserId(userId)
            }
            fetchDataFromGoogleFit(authData.access_token)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        sumPointsFn(activData, setSumPoints);

    }, [activData])

    useEffect(() => {
        const differenceMilliseconds = new Date().getTime() - new Date('2024-04-01').getTime();
        const passedDays = Math.floor(differenceMilliseconds / 86400000);
        const pointsPerDay = sumPoints / passedDays;
        calculateLvl(lvls, pointsPerDay, setProgress)
    }, [sumPoints])


    console.log(progress)
    return (
        <div style={{ fontFamily: 'monospace' }}>
            <h1 style={{ paddingTop: '1rem' }}>Demo season</h1>
            <p style={{ marginBottom: '2rem' }}>from April 1, 2024</p>
            {/* <p>main_userId: {userId}</p> */}
            {!userId && <p>не получил userId</p>}

            {/* {authData && <pre>bdId:{authData.id}</pre>} */}


            <div style={{ margin: '2rem 2rem 0.5rem 2rem', width: '50' }}>
                <h1 style={{ fontSize: '3rem', color: 'rgb(14 165 233)', fontFamily: 'monospace' }}>{sumPoints}</h1>
            </div>
            <div style={{ marginBottom: '2rem' }}>

                <div style={{ margin: '5px 1em 5px' }} className='progress'>
                    <div style={{ width: `${(progress.current_points - progress.start_lvl) / (progress.next_lvl - progress.start_lvl) * 100}%` }} className="progress-bar"></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0 1rem' }}>
                    <div>
                        <p>{progress.start_lvl}</p>
                        <p>per day</p>
                    </div>

                    <h2 style={{ fontFamily: 'monospace' }}>Level {progress.current_lvl}</h2>

                    <div>
                        <p>{progress.next_lvl}</p>
                        <p>per day</p>
                    </div>

                </div>
            </div>

            <div style={{ float: "left", width: '50%', margin: '5px 1em 5px' }}>
                <div>
                    <h3 style={{ textAlign: 'left' }}>Cardio: {activData.cardio && activData.cardio}</h3>
                    <h3 style={{ textAlign: 'left' }}>Kcal: {activData.calories && activData.calories}</h3>
                    <h3 style={{ textAlign: 'left' }}>Steps: {activData.steps && activData.steps}</h3>
                </div>
                <p>====</p>
            </div>


        </div>
    )
}
