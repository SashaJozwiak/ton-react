import { useEffect, useState } from 'react';
import { ActivityData } from '../../utils/queries/fetchData';

import { calcEnemy } from '../../utils/math/calcEnemy';
import { battlePoints, getBattlesDataFn, setKicks } from '../../utils/queries/battles/battlePoints';

import chel from '../../assets/battles/chel_edit2_tr.png';
import enemyPic from '../../assets/battles/chel_edit_tr.png';
import loader from '../../assets/loading-gif.gif'

import { IProgress } from '../../App';

import './Battles.css';
import Timer from '../Timer/Timer';

interface BattlesProps {
    activData: ActivityData;
    progress: IProgress;
    userId: number;
    AllBattlePoints: number;
}
interface IEnemy {
    level: number | null;
    cardio: number | null;
    calories: number | null;
    steps: number | null;
}
interface IBattleStatus {
    search: boolean;
    inBattle: boolean;
}
enum IBattleResult {
    init = 'init',
    win = 'win',
    lose = 'lose',
}
interface IBattlesDataCount {
    battles_count: number;
    last_battle_date: number;
}

const Battles: React.FC<BattlesProps> = ({ userId, activData, progress, AllBattlePoints }) => {

    const [localBattlePoints, setLocalBattlePoints] = useState(AllBattlePoints);
    const [battlesDataCount, setBattlesDataCount] = useState<IBattlesDataCount>({
        battles_count: 0,
        last_battle_date: 0
    });

    const [battleStatus, setBattlesStatus] = useState<IBattleStatus>({
        search: false,
        inBattle: false
    });

    const [enemy, setEnemy] = useState<IEnemy>({
        level: null,
        cardio: null,
        calories: null,
        steps: null
    });

    const [kickCount, setKickCount] = useState<number>(0);
    const [kickValue, setKickedValue] = useState<string>('');
    const [result, setResult] = useState<IBattleResult>(IBattleResult.init);

    const searchEnemyFn = (lvl: number) => {

        setKickedValue('')
        setBattlesStatus((prev) => {
            return {
                ...prev,
                search: true
            }
        })

        const enemyData = calcEnemy(activData, lvl);
        const delay = Math.random() * (1500 - 500) + 500;

        setTimeout(() => {
            setEnemy(enemyData);
            setBattlesStatus((prev) => {
                return {
                    ...prev,
                    search: false,
                    inBattle: true
                }
            })
        }, delay);
    };

    const fightFn = async (type: string) => {
        setKickedValue(type);
        setBattlesStatus((prev) => {
            return {
                ...prev,
                inBattle: false
            }
        })
        //const isWin = activData[type] > enemy[type] ? true : false;
        const isWin = activData[type] > (enemy[type] ?? 0);

        if (isWin) {
            await battlePoints(userId, 10)
            setLocalBattlePoints((prev) => prev + 10)
            setResult(IBattleResult.win);
        } else {
            await battlePoints(userId, -2)
            setLocalBattlePoints((prev) => prev - 2)
            setResult(IBattleResult.lose);
        }
        setKickCount(prev => prev - 1)
        await setKicks(userId, 1);

        setTimeout(() => {
            setResult(IBattleResult.init);
        }, 2500);
    };

    const getBattlesData = async () => {
        const battlesData = await getBattlesDataFn(userId);
        console.log(battlesData)
        const { battles_count, last_battle_date } = battlesData;
        setBattlesDataCount({
            battles_count: battles_count,
            last_battle_date: new Date(last_battle_date).getTime()
        })
    }

    const resetCountKicks = async (userId: number, value: number) => {
        await setKicks(userId, value);
    }

    useEffect(() => {
        getBattlesData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (battlesDataCount.last_battle_date !== 0) {
        const kicks: number = progress.current_lvl <= 10 ? progress.current_lvl : ((progress.current_lvl - 10) / 5) + 10;
        const currentDate: number = Date.now();
            console.log('lastDataBattle: ', battlesDataCount.last_battle_date)
        const lastBattleDate: number = new Date(battlesDataCount.last_battle_date).getTime();
            const currentKickCount = (+kicks.toFixed()) - battlesDataCount.battles_count;
            setKickCount(currentKickCount);

            const differentTimeInHours = (currentDate - lastBattleDate) / 3600000;
            console.log('currentDate: ', currentDate);
            console.log('lastBattleDate: ', lastBattleDate);
            console.log('differentTime (in hours): ', differentTimeInHours);

            if (differentTimeInHours >= 0.1) {
            //if been 24 hours
            console.log('reset Count Kicks2: ', currentDate - lastBattleDate)
            resetCountKicks(userId, 0);
                setKickCount(0);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progress.current_lvl, battlesDataCount])

    console.log('BattlesCountData: ', battlesDataCount)
    return (
        <div
            className={battleStatus.search ? 'disabled_search' : ''}
            style={{ display: 'flex', flexDirection: 'column', marginTop: '-0.5rem', gap: '0.5rem' }}>

            <h3 style={{ fontSize: '1rem', fontFamily: 'monospace', color: 'rgb(100 116 139)' }}>
                You have&nbsp;
                <span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0.1rem 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                    {kickCount}
            </span>
                <p style={{ display: 'inline' }}> kicks</p>
            </h3>
            <div style={{ display: 'flex', marginTop: '1rem', alignItems: 'center', justifyContent: 'space-evenly' }}>

                {battleStatus.search && <img className='loader' src={loader} alt="loader" width={'50'} />}

                {result === 'win' && <h1 className='points'>+10</h1>}
                {result === 'lose' && <h1 className='points_lose'>-2</h1>}

                <div>
                    <h2>Level:
                        <span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0.1rem 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                            {progress.current_lvl}
                        </span>
                    </h2>
                    <img width='105%' src={chel} alt="man picture" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', color: 'rgb(100, 116, 139)' }}>
                        <h2>Cardio</h2>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <h4 className='values'>{activData.cardio}</h4>
                            <p style={{ margin: '0 2%' }}>{`>`}</p>
                            <h4 className='values'>{kickValue === 'cardio' ? enemy.cardio : '????'}</h4>
                        </div>
                        <button
                            onClick={() => fightFn('cardio')}
                            disabled={!battleStatus.inBattle}
                            style={{ marginTop: '5%', padding: '1vh 3vw', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '0.25rem', boxShadow: '0 0px 5px red, 0 0px 0px rgba(0,0,0,0.1)', color: 'rgb(14 165 233)', fontWeight: 'bold', opacity: battleStatus.inBattle ? 1 : 0.25 }}
                        >Kick</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', color: 'rgb(100, 116, 139)' }}>
                        <h2>Kcal</h2>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <h4 className='values'>{activData.calories}</h4>
                            <p style={{ margin: '0 2%' }}>{`>`}</p>
                            <h4 className='values'>{kickValue === 'calories' ? enemy.calories : '?????'}</h4>
                        </div>
                        <button
                            onClick={() => fightFn('calories')}
                            disabled={!battleStatus.inBattle}
                            style={{ marginTop: '5%', padding: '1vh 3vw', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '0.25rem', boxShadow: '0 0px 5px red, 0 0px 0px rgba(0,0,0,0.1)', color: 'rgb(14 165 233)', fontWeight: 'bold', opacity: battleStatus.inBattle ? 1 : 0.25 }}
                        >Kick</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', color: 'rgb(100, 116, 139)' }}>
                        <h2>Steps</h2>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <h4 className='values'>{activData.steps}</h4>
                            <p style={{ margin: '0 2%' }}>{`>`}</p>
                            <h4 className='values'>{kickValue === 'steps' ? enemy.steps : '?????'}</h4>
                        </div>
                        <button
                            onClick={() => fightFn('steps')}
                            disabled={!battleStatus.inBattle}
                            style={{ marginTop: '5%', padding: '1vh 3vw', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '0.25rem', boxShadow: '0 0px 5px red, 0 0px 0px rgba(0,0,0,0.1)', color: 'rgb(14 165 233)', fontWeight: 'bold', opacity: battleStatus.inBattle ? 1 : 0.25 }}
                        >Kick</button>
                    </div>
                </div>

                <div>
                    <h2>Level:
                        <span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0.1rem 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                            {enemy.level || '?'}
                        </span>
                    </h2>
                    <img
                        className={!battleStatus.inBattle ? 'disabled_search' : ''}
                        width='105%' src={battleStatus.inBattle ? chel : enemyPic} alt="man picture" />
                </div>
            </div>

            <h3 style={{ fontSize: '1rem', fontFamily: 'monospace', color: 'rgb(100 116 139)' }}>Your total battle points  <span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0.1rem 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                {localBattlePoints}
            </span>
            </h3>

            <button
                onClick={() => searchEnemyFn(progress.current_lvl)}
                disabled={battleStatus.inBattle || battleStatus.search || kickCount === 0}
                className={battleStatus.inBattle || battleStatus.search || kickCount === 0 ? 'disabled_btn' : ''}
                style={{ padding: '0.5rem', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '0.25rem', boxShadow: '0 0px 5px rgb(14 165 233), 0 0px 0px rgb(14 165 233)', color: 'rgb(14 165 233)', fontWeight: 'bold', fontSize: '1rem', width: '80%', margin: '0.3rem auto' }}>{kickCount === 0 ? <Timer lastBattleDate={battlesDataCount.last_battle_date} /> : 'SEARCH BATTLE'}
            </button>
        </div>
    )
}

export default Battles;
