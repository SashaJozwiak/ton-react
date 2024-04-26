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
    authData: AuthData | null;
    fetchUserData: () => void;
}

export interface IProgress {
    current_lvl: number,
    current_points: number,
    start_lvl: number,
    next_lvl: number,
}

export const Main: React.FC<MainProps> = ({ userId, authData, fetchUserData }) => {
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
            await fetchUserData();
        }

        if (authData !== null) {
            //console.log(authData.expiry_date)
            const unixExpire = new Date(authData.expiry_date).getTime();
            console.log(unixExpire)
            if (unixExpire - 300000 < Date.now()) {
                console.log('token expired');
                refressAcc();

                //setUserId(userId)
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
        console.log(differenceMilliseconds, passedDays, pointsPerDay)
        calculateLvl(lvls, pointsPerDay, setProgress)
    }, [sumPoints])

    console.log(progress)
    return (
        <div style={{ fontFamily: 'monospace' }}>

            {/* <p>main_userId: {userId}</p> */}
            {!userId && <p>не получил userId</p>}

            {/* {authData && <pre>bdId:{authData.id}</pre>} */}


            <div style={{ padding: '1rem 0', borderRadius: '0.5rem', margin: '1rem 1rem 1.5rem 1rem', width: '50', boxShadow: '0 0px 5px rgba(0,0,0,0.1), 0 0px 0px rgba(0,0,0,0.1)' }}>
                <h1 style={{ fontSize: '3rem', color: 'rgb(14 165 233)', textShadow: '1px 2px 2px rgba(0,0,0,0.3), 0px -4px 10px rgba(255,255,255,0.3)' }}>{sumPoints}</h1>
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

                    <h2 style={{ fontFamily: 'monospace' }}>Level                    <span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0.1rem 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                        {progress.current_lvl}
                    </span>
                    </h2>

                    <div>
                        <p>{progress.next_lvl}</p>
                        <p>per day</p>
                    </div>

                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', width: '80vw', margin: '0 auto 2rem', border: '0px solid grey', borderRadius: '0.25rem', padding: '0.5rem', boxShadow: 'inset 2px 2px 5px rgba(154, 147, 140, 0.5), 1px 1px 5px rgba(255, 255, 255, 1)' }}>
                <h2 style={{ /* textDecoration: 'underline', */ color: 'rgba(14, 165, 233, 0.6)' }}>Onlife</h2>
                <div>
                    <p style={{ fontSize: '1rem' }}>Cardio: {activData.cardio && activData.cardio}</p>
                    <p style={{ fontSize: '1rem' }}>Kcal: {activData.calories && activData.calories}</p>
                    <p style={{ fontSize: '1rem' }}>Steps: {activData.steps && activData.steps}</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', width: '80vw', margin: '0 auto', border: '0px solid grey', borderRadius: '0.25rem', padding: '0.5rem', boxShadow: 'inset 2px 2px 5px rgba(154, 147, 140, 0.5), 1px 1px 5px rgba(255, 255, 255, 1)' }}>
                <h2 style={{ /* textDecoration: 'underline', */ color: 'rgba(14, 165, 233, 0.6)' }}>Online</h2>
                <div>
                    <p style={{ fontSize: '1rem' }}>Frens: {0}</p>
                    <p style={{ fontSize: '1rem' }}>Tasks: {0}</p>
                    <p style={{ fontSize: '1rem' }}>Battles: {0}</p>
                </div>
            </div>
        </div>
    )
}
