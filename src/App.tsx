import './App.css';

import '@twa-dev/sdk';

import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';


function App() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  console.log(value, address);
  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          /* style={{ border: '1px solid gray', padding: '1%' }} */
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      </div>
    </div>
  );
}

export default App