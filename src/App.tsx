import './App.css';

import WebApp from '@twa-dev/sdk';

//import { TonConnectButton } from '@tonconnect/ui-react';
//import { useTonConnect } from './hooks/useTonConnect';
//import { useCounterContract } from './hooks/useCounterContract';
//import { Go } from './components/Go/Go';

import eruda from 'eruda'
import { Main } from './components/main/Main';
import { useEffect, useState } from 'react';

eruda.init();//just for debug
console.log('go')

interface AuthData {
  id: number;
  user_id: string;
  access_token: string;
  refresh_token: string;
}

function App() {
  //const { connected } = useTonConnect();
  //const { value, address, sendIncrement } = useCounterContract();

  const [authData, setAuthData] = useState<AuthData[]>([]);
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {

    if (WebApp.initDataUnsafe.user) {
      const getUserId = WebApp.initDataUnsafe.user.id
      setUserId(getUserId)
    } else {
      console.log('test user')
      setUserId(757322479)
    }

    console.log(`http://localhost:3000/profile?userId=${userId}`)

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/profile?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setAuthData(jsonData);
        console.log(jsonData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log(authData)
  console.log(authData[0])
  console.log(authData[0].id)

  //console.log(value, address);
  return (
    <div className='App'>

      <div className='Container'>
        some text

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

      <Main userId={userId} />
      <p>{userId} - {typeof userId}</p>
      {!userId && <p>не получил userId</p>}
      {authData.length > 0 ? <pre>{authData[0].id}</pre> : 'no data'}

    </div>
  );
}

export default App
