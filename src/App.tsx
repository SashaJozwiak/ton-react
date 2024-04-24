import './App.css';

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

  useEffect(() => {

    if (WebApp.initDataUnsafe.user) {
      const getUserId = WebApp.initDataUnsafe.user.id
      setUserId(getUserId)
    } else {
      console.log('test user')
      setUserId(757322479)
    }

    const fetchUserData = async () => {
      try {
        console.log(`in fetch data — http://localhost:3000/profile?userId=${userId}`)
        const response = await fetch(`http://localhost:3000/profile?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setAuthData(jsonData[0]);
        setIsLoading(false)
        setError(false)
        setIsPopupOpen(false)
      } catch (error) {

        setIsPopupOpen(true)
        setError(true)
        console.error('Error fetching data:', error);
      }
    };
    console.log(WebApp)

    fetchUserData();
  }, [userId])

  console.log(authData)

  //console.log(value, address);
  return (
    <div className='App'>
      <BlockingPopup isPopupOpen={isPopupOpen} />

      {isLoading ? (
        <div>
          Loading...
        </div>
      ) :
        <div>
          <Main userId={userId} authData={authData} />

          <p>{userId} - тип: {typeof userId}</p>

          {error && <p>Вам нужно авторизоваться</p>}
        </div>

      }

      <div className='Container'>
        Container

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
      </div>
      {/* <GoogleAuthButton /> */}
      {/* <Go /> */}



    </div>
  );
}

export default App
