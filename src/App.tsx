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

import BlockingPopup from './components/Popups/AuthPopup';

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
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [userId, setUserId] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [routes, setRoutes] = useState('');

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
    if (WebApp.initDataUnsafe.user) {
      const getUserId = WebApp.initDataUnsafe.user.id
      setUserId(getUserId)
    } else {
      console.log('test user')
      setUserId(757322479)
    }
    console.log(WebApp)
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

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
          {routes === 'main' && <Main userId={userId} /* setUserId={setUserId} */ authData={authData} fetchUserData={fetchUserData} />}
          {routes === 'tasks' && <p>Tasks</p>}
          {routes === 'battles' && <p>Battles</p>}


          {error && <p>Вам нужно авторизоваться</p>}
        </div>

      }

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
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} className="footer">

        <div style={{ border: '0px solid rgb(14 165 233)', borderRadius: '1rem 1rem 0 0', width: '50%', background: `${routes === 'main' ? 'rgba(14, 165, 233, 0.4)' : 'transparent'}` }}
          onClick={() => setRoutes('main')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgb(14 165 233)" style={{ paddingTop: '5%', width: '70%' /* padding: '0.5rem' */ }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
          </svg>
        </div>

        <div style={{ border: '0px solid grey', borderRadius: '1rem 1rem 0 0', width: '50%', background: `${routes === 'tasks' ? 'rgba(14, 165, 233, 0.4)' : 'transparent'}` }}
          onClick={() => setRoutes('tasks')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgb(14 165 233)" style={{ paddingTop: '5%', width: '70%'/* padding: '0.5rem' */ }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
        </div>

        <div style={{ border: '0px solid grey', borderRadius: '1rem 1rem 0 0', width: '50%', background: `${routes === 'battles' ? 'rgba(14, 165, 233, 0.4)' : 'transparent'}` }}
          onClick={() => setRoutes('battles')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgb(14 165 233)" style={{ paddingTop: '5%', width: '70%'/* padding: '0.5rem' */ }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
          </svg>
        </div>

        <div style={{ border: '0px solid grey', borderRadius: '1rem 1rem 0 0', width: '50%' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgba(14, 165, 233, 0.4)" style={{ paddingTop: '5%', width: '70%'/* padding: '0.5rem' */ }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
          </svg>
        </div>

        <div style={{ border: '0px solid grey', borderRadius: '1rem 1rem 0 0', width: '50%' }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgba(14, 165, 233, 0.4)" style={{ paddingTop: '5%', width: '70%'/* padding: '0.5rem' */ }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </div>

      </div>

    </div>
  );
}

export default App
