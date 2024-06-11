import { useState } from 'react';
import { ActivityData } from '../../utils/queries/fetchData';

import chel from '../../assets/battles/chel_edit2_tr.png'
//import heart from '../../assets/battles/heart_1.png'
//import stomach from '../../assets/battles/stomach_1.png'
//import leg from '../../assets/battles/leg_1.png'
import loader from '../../assets/loading-gif.gif'

import './Battles.css';
import { IProgress } from '../../App';
import { calcEnemy } from '../../utils/math/calcEnemy';


interface BattlesProps {
    activData: ActivityData;
    progress: IProgress;
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

const Battles: React.FC<BattlesProps> = ({ activData, progress }) => {

    //const [battlesCount, setBattlesCount] = useState(0);
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

    const fightFn = (type: string) => {
        console.log(type);
        setKickedValue(type);
        setBattlesStatus((prev) => {
            return {
                ...prev,
                inBattle: false
            }
        })
        const isWin = activData[type] > enemy[type] ? true : false;

        if (isWin) {
            setResult(IBattleResult.win);
        } else {
            setResult(IBattleResult.lose);
        }

        setTimeout(() => {
            setResult(IBattleResult.init);
        }, 2500);
    };

    console.log(progress.current_lvl)
    return (
        <div
            className={battleStatus.search ? 'disabled_search' : ''}
            style={{ display: 'flex', flexDirection: 'column', marginTop: '-0.5rem' }}>

            <h3 style={{ fontSize: '1rem', fontFamily: 'monospace', color: 'rgb(100 116 139)' }}>You have <span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0.1rem 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                ꝏ
            </span>
                <p style={{ display: 'inline' }}> battles</p>
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
                            style={{ marginTop: '5%', padding: '1vh 3vw', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '0.25rem', boxShadow: '0 0px 5px red, 0 0px 0px rgba(0,0,0,0.1)', color: 'rgb(14 165 233)', fontWeight: 'bold', opacity: battleStatus.inBattle ? 1 : 0.5 }}
                        >Fight</button>
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
                            style={{ marginTop: '5%', padding: '1vh 3vw', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '0.25rem', boxShadow: '0 0px 5px red, 0 0px 0px rgba(0,0,0,0.1)', color: 'rgb(14 165 233)', fontWeight: 'bold', opacity: battleStatus.inBattle ? 1 : 0.5 }}
                        >Fight</button>
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
                            style={{ marginTop: '5%', padding: '1vh 3vw', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '0.25rem', boxShadow: '0 0px 5px red, 0 0px 0px rgba(0,0,0,0.1)', color: 'rgb(14 165 233)', fontWeight: 'bold', opacity: battleStatus.inBattle ? 1 : 0.5 }}
                        >Fight</button>
                    </div>
                </div>

                <div>
                    <h2>Level:
                        <span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0.1rem 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                            {enemy.level || '??'}
                        </span>
                    </h2>
                    <img
                        className={!battleStatus.inBattle ? 'disabled_search' : ''}
                        width='105%' src={chel} alt="man picture" />
                </div>
            </div>

            <button
                onClick={() => searchEnemyFn(progress.current_lvl)}
                disabled={battleStatus.inBattle || battleStatus.search}
                className={battleStatus.inBattle || battleStatus.search ? 'disabled_search' : ''}
                style={{ padding: '0.5rem', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '0.25rem', boxShadow: '0 0px 5px rgb(14 165 233), 0 0px 0px rgb(14 165 233)', color: 'rgb(14 165 233)', fontWeight: 'bold', fontSize: '1rem', width: '80%', margin: '0.3rem auto' }}>SEARCH BATTLE
            </button>
        </div>
    )
}

export default Battles
