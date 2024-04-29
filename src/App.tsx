import './App.css';
import '@twa-dev/sdk';
import WebApp from '@twa-dev/sdk';

//import { TonConnectButton } from '@tonconnect/ui-react';
//import { useTonConnect } from './hooks/useTonConnect';
//import { useCounterContract } from './hooks/useCounterContract';
//import { Go } from './components/Go/Go';

import eruda from 'eruda'
import { Main } from './components/main/Main';
import { useEffect, useState } from 'react';

import { ActivityData } from './utils/queries/fetchData';

import BlockingPopup from './components/Popups/AuthPopup';
import Navbar from './components/Navbar/Navbar';
import Tasks from './components/Tasks/Tasks';

eruda.init();//just for debug
console.log('go')

export interface AuthData {
  id: number;
  user_id: string;
  access_token: string;
  refresh_token: string;
  email: string;
  expiry_date: 'string';
}

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

  const [sumPoints, setSumPoints] = useState<number>(0);

  const fetchUserData = async () => {
    try {
      console.log(`in fetch data — http://localhost:3000/profile?userId=${userId}`)
      const response = await fetch(`http://localhost:3000/profile?userId=${userId}`);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userId !== 0) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  console.log(authData)

  return (
    <div className='App' style={{ fontFamily: 'monospace' }}>
      <BlockingPopup isPopupOpen={isPopupOpen} userId={userId} />
      <h1 style={{ paddingTop: '1rem', color: 'rgb(100 116 139)' }}>🏆 Demo season 🏃</h1>
      <p style={{ marginBottom: '2rem' }}>from April 1, 2024</p>

      {isLoading ? (
        <div>
          Loading...
        </div>
      ) :
        <div>
          {routes === 'main' && <Main userId={userId} authData={authData} setAuthData={setAuthData} activData={activData} setActivData={setActivData} sumPoints={sumPoints} setSumPoints={setSumPoints} />}
          {routes === 'tasks' && <Tasks userId={userId} />}
          {routes === 'battles' && <p>Battles</p>}

          {error && <p>Вам нужно авторизоваться</p>}
        </div>

      }

      <Navbar routes={routes} setRoutes={setRoutes} />

      {/* <div className='Container'> */}
      {/* Container */}

        {/* <TonConnectButton /> */}

        {/*  <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 20) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a> */}
      {/* </div> */}
      {/* <GoogleAuthButton /> */}
      {/* <Go /> */}


    </div>
  );
}

export default App
