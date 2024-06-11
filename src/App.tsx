//import '@twa-dev/sdk';
//import { TonConnectButton } from '@tonconnect/ui-react';
//import { useTonConnect } from './hooks/useTonConnect';
//import { useCounterContract } from './hooks/useCounterContract';
//import { Go } from './components/Go/Go';

import eruda from 'eruda'
import { Main } from './components/main/Main';
import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

import { ActivityData } from './utils/queries/fetchData';
import BlockingPopup from './components/Popups/AuthPopup';
import Navbar from './components/Navbar/Navbar';
import Tasks from './components/Tasks/Tasks';
import Teams from './components/Teams/Teams';
import Battles from './components/Battles/Battles';
import Profile from './components/Profile/Profile';
import './App.css';
import { postOnlifeBalance } from './utils/queries/postBalance';

eruda.init();//just for debug

export interface AuthData {
  id: number;
  user_id: string;
  access_token: string;
  refresh_token: string;
  email: string;
  expiry_date: 'string';
  ref_by: string | null;
  ref_team_by: number | null;
}


export interface IProgress {
  current_lvl: number,
  current_points: number,
  start_lvl: number,
  next_lvl: number,
}


/* export interface onLifeBalance {
  battles:number;
  frens:number;
  tasks:number;
} */

function App() {
  //const { connected } = useTonConnect();
  //const { value, address, sendIncrement } = useCounterContract();

  //auth, routes
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [userId, setUserId] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [routes, setRoutes] = useState('main');

  //user data
  const [activData, setActivData] = useState<ActivityData>({
    steps: 0,
    cardio: 0,
    calories: 0,
  });

  const [onLifeBalance, setOnLifeBalance] = useState<Record<string, number>>({
    battles: 0,
    frens: 0,
    tasks: 0,
  });

  console.log(onLifeBalance)

  const [sumPoints, setSumPoints] = useState<number>(0);

  const [progress, setProgress] = useState<IProgress>({
    current_lvl: 0,
    current_points: 0,
    start_lvl: 0,
    next_lvl: 0,
  });

  const fetchUserData = async () => {
    try {
      console.log(`in fetch data — https://fitton.online/profile?userId=${userId}`)
      const response = await fetch(`https://fitton.online/profile?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      await setAuthData(jsonData[0]);
      setIsLoading(false)
      setError(false)
      setIsPopupOpen(false)
    } catch (error) {
      setIsPopupOpen(true)
      setError(true)
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (WebApp.initDataUnsafe.user) {
          const getUserId = WebApp.initDataUnsafe.user.id;
          setUserId(getUserId);
        } else {
          console.log('test user');
          setUserId(757322479);
        }
        //await fetchUserData();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
    if (!WebApp.isExpanded) {

      WebApp.expand();
      console.log('expanded');
    } else {
      console.log('before expanded')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userId !== 0) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (sumPoints > 0) {
      const addFitAndSumBalance = postOnlifeBalance(userId, activData, Math.round(sumPoints))
      console.log(addFitAndSumBalance)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sumPoints]);


  console.log('authData: ', authData?.ref_team_by)
  console.log('onLifeData: ', onLifeBalance, 'activData: ', activData);

  return (
    <div className='App' style={{ fontFamily: 'monospace' }}>
      <BlockingPopup isPopupOpen={isPopupOpen} userId={userId} />

      <h1 style={{ paddingTop: '0.5rem', color: 'rgb(100 116 139)', fontSize: 'calc(3vw + 3vh)' }}>
        🏆Fitton
        {!isPopupOpen && <span style={{ position: 'relative', top: '-2vh', fontSize: '2.5vh', color: 'rgb(14, 165, 233)' }}>&alpha;</span>}
        🏃</h1>
      <p style={{ marginBottom: '1.5rem', fontSize: 'calc(2.2vw + 1vh)' }}>&nbsp;&nbsp;Season: June'24</p>

      {isLoading ? (
        <div>
          Loading...
        </div>
      ) :
        <>
          {routes === 'main' && <Main userId={userId} authData={authData} setAuthData={setAuthData} activData={activData} setActivData={setActivData} sumPoints={sumPoints} setSumPoints={setSumPoints} setRoutes={setRoutes} onLifeBalance={onLifeBalance} setOnLifeBalance={setOnLifeBalance} progress={progress} setProgress={setProgress} />}
          {routes === 'teams' && <Teams userId={userId} setRoutes={setRoutes}  /* myTeamId={authData?.ref_team_by} */ />}
          {routes === 'profile' && <Profile userId={userId} setRoutes={setRoutes} authData={authData} />}
          {routes === 'tasks' && <Tasks userId={userId} setRoutes={setRoutes} />}
          {routes === 'battles' && <Battles userId={userId} activData={activData} progress={progress} AllBattlePoints={onLifeBalance.battles} />}

          {error && <p>Вам нужно авторизоваться</p>}
        </>
      }
      {!isPopupOpen && <Navbar routes={routes} setRoutes={setRoutes} />}
    </div>
  );
}

export default App
