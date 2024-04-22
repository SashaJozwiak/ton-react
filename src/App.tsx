import './App.css';

import '@twa-dev/sdk';

//import { TonConnectButton } from '@tonconnect/ui-react';
//import { useTonConnect } from './hooks/useTonConnect';
//import { useCounterContract } from './hooks/useCounterContract';
//import { Go } from './components/Go/Go';

import eruda from 'eruda'
import { Main } from './components/main/Main';
import { useEffect, useState } from 'react';

eruda.init();//just for debug
console.log('go')

function App() {
  //const { connected } = useTonConnect();
  //const { value, address, sendIncrement } = useCounterContract();

  const [userId, setUserId] = useState(null);

  useEffect(() => {

    setUserId(window.Telegram.WebApp.initDataUnsafe.user.id)


    /* const fetchData2 = async () => {
      try {
        const response = await fetch('http://localhost:3000/profile?');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setSomeData2(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }; */

    //fetchData2();

  }, [])

  //console.log(value, address);
  return (
    <div className='App'>

      <div className='Container'>

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

      <Main />
      {!userId && <p>не получил userId</p>}

    </div>
  );
}

export default App
