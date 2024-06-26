import { useEffect/* , useState */ } from 'react';
import { AuthData } from '../../App';
import { ActivityData, getActivities } from '../../utils/queries/fetchData';
import { getBalance } from '../../utils/queries/getBalance';
import { refreshAccessToken } from '../../utils/queries/refreshAccessToken';

import { lvls } from '../../utils/math/lvls';
import { calculateLvl, sumPointsFn } from '../../utils/math/points';

import { IProgress } from '../../App';

import './Main.css';

interface MainProps {
    userId: number;
    authData: AuthData | null;
    setAuthData: (AuthData) => void;
    activData: ActivityData;
    setActivData: (arg0: ActivityData) => void;
    sumPoints: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSumPoints: (pr: number) => void;
    setRoutes: (pr: string) => void;
    onLifeBalance: Record<string, number>;
    setOnLifeBalance: (pr: Record<string, number>) => void;
    progress: IProgress;
    setProgress: (pr: IProgress) => void;
}

export const Main: React.FC<MainProps> = ({ userId, authData, setAuthData, activData, setActivData, sumPoints, setSumPoints, setRoutes, onLifeBalance, setOnLifeBalance, progress, setProgress }) => {

    async function fetchDataFromGoogleFit(token: string, userId: number) {
        try {
            console.log('Fetching activities...');
            const activity = await getActivities(token);
            console.log('Activities fetched:', activity);

            console.log('Fetching balance...');
            const getOnLifeBalance = await getBalance(userId);
            console.log('Balance fetched:', getOnLifeBalance);

            setActivData(activity);
            setOnLifeBalance(getOnLifeBalance);
            console.log('Data refresh complete');
        } catch (error) {
            console.error('Error fetching user data from Google Fit and db online balance:', error);
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function refreshAcc() {
        const newAccessToken = await refreshAccessToken(authData!.refresh_token, userId)
        console.log('newAccessToken', newAccessToken)
        await setAuthData((e: AuthData) => {
            return {
                ...e,
                access_token: newAccessToken.tokens.access_token,
                expiry_date: newAccessToken.tokens.expiry_date,
            }
        })
        //await fetchUserData();
    }

    useEffect(() => {
        if (authData !== null) {
            const unixExpire = new Date(authData.expiry_date).getTime();
            console.log(unixExpire)
            if (unixExpire - 300000 < Date.now()) {
                console.log('token expired');
                refreshAcc();
            }
            fetchDataFromGoogleFit(authData.access_token, userId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authData])

    useEffect(() => {
        console.log('prepare sum: ', activData, onLifeBalance)
        if (activData.steps + activData.calories + activData.cardio + onLifeBalance.battles +
            onLifeBalance.frens + onLifeBalance.tasks !== 0) {
            sumPointsFn(activData, setSumPoints, onLifeBalance);
        }
    }, [activData, onLifeBalance, setOnLifeBalance, setSumPoints])

    useEffect(() => {
        const differenceMilliseconds = new Date().getTime() - new Date('2024-06-01').getTime();// change for season start
        const passedDays = Math.floor(differenceMilliseconds / 86400000);
        const pointsPerDay = sumPoints / passedDays;
        console.log(differenceMilliseconds, passedDays, pointsPerDay)
        calculateLvl(lvls, pointsPerDay, setProgress)
    }, [setProgress, sumPoints])

    return (
        <div style={{ fontFamily: 'monospace', overflowY: 'scroll', paddingTop: '1.3rem', marginTop: '-1.3rem' }}>
            <div style={{ position: 'relative', padding: '0.5rem 0', borderRadius: '0.5rem', margin: '1rem 1rem 2vh 1rem', width: '50', boxShadow: '0 0px 5px rgba(0,0,0,0.1), 0 0px 0px rgba(0,0,0,0.1)' }}>
                <button
                    onClick={() => { setRoutes('teams') }}
                    style={{ position: 'absolute', top: '-50%', right: '0', padding: '0.5rem', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '0.25rem', boxShadow: '0 0px 5px rgba(0,0,0,0.1), 0 0px 0px rgba(0,0,0,0.1)', color: 'rgb(14 165 233)', fontWeight: 'bold', fontSize: 'calc(1.5vh + 1.5vw)' }}>Teams
                </button>

                <button
                    onClick={() => { setRoutes('profile') }}
                    style={{ position: 'absolute', top: '-50%', left: '0', padding: '0.5rem', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '0.25rem', boxShadow: '0 0px 5px rgba(0,0,0,0.1), 0 0px 0px rgba(0,0,0,0.1)', color: 'rgb(14 165 233)', fontWeight: 'bold', fontSize: 'calc(1.5vh + 1.5vw)' }}>Profile
                </button>

                <h1 style={{ fontSize: '6.5vh', color: 'rgb(14 165 233)', textShadow: '1px 2px 2px rgba(0,0,0,0.3), 0px -4px 10px rgba(255,255,255,0.3)' }}>{sumPoints || 0}</h1>
            </div>

            <div style={{ marginBottom: '3vh' }}>
                <div style={{ margin: '5px 1em 5px' }} className='progress'>
                    <div style={{ width: `${(progress.current_points - progress.start_lvl) / (progress.next_lvl - progress.start_lvl) * 100}%` }} className="progress-bar"></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0 1rem' }}>
                    <div>
                        <p style={{ fontSize: 'calc(1.6vw + 1.6vh)' }}>{progress.start_lvl}</p>
                        <p style={{ fontSize: 'calc(1.3vw + 1.3vh)' }}>per day</p>
                    </div>

                    <h1 style={{ fontFamily: 'monospace', color: 'rgb(100 116 139)' }}>Level                    <span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0.1rem 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                        {progress.current_lvl}
                    </span>
                    </h1>

                    <div>
                        <p style={{ fontSize: 'calc(1.6vw + 1.6vh)' }}>{progress.next_lvl}</p>
                        <p style={{ fontSize: 'calc(1.3vw + 1.3vh)' }}>per day</p>
                    </div>

                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', height: '46vh' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '80vw', maxWidth: '1280px', gap: '0.1rem', margin: '0 auto 1rem', border: '0px solid grey', borderRadius: '0.25rem', padding: '1rem', boxShadow: 'inset 2px 2px 5px rgba(154, 147, 140, 0.5), 1px 1px 5px rgba(255, 255, 255, 1)' }}>
                    <h2 style={{ textDecoration: 'underline', textUnderlineOffset: '0.15em', color: 'rgba(14, 165, 233, 0.6)', marginBottom: '0.2rem' }}>Onlife</h2>
                    <div>
                        <p style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>Cardio:
                            <span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                                {activData.cardio && activData.cardio}
                            </span>

                        </p>
                        <p style={{ fontSize: '1rem', marginBottom: '0.1rem' }}>Kcal:
                            <span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                                {activData.calories && activData.calories}
                            </span>
                        </p>
                        <p style={{ fontSize: '1rem' }}>Steps:
                            <span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                                {activData.steps && activData.steps}
                            </span>
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '80vw', maxWidth: '1280px', margin: '0 auto', border: '0px solid grey', borderRadius: '0.25rem', padding: '1rem', boxShadow: 'inset 2px 2px 5px rgba(154, 147, 140, 0.5), 1px 1px 5px rgba(255, 255, 255, 1)' }}>
                    <h2 style={{ textDecoration: 'underline', textUnderlineOffset: '0.15em', color: 'rgba(14, 165, 233, 0.6)', marginBottom: '0.2rem' }}>Online</h2>
                    <div>
                        <p style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>Frens:
                            <span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                                {onLifeBalance.frens}
                            </span>
                        </p>
                        <p style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>Tasks:
                            <span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                                {onLifeBalance.tasks}
                            </span>
                        </p>
                        <p style={{ fontSize: '1rem' }}>Battles:
                            <span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                                {onLifeBalance.battles}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
