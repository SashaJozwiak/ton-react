import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx';

import { TonConnectUIProvider } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk'

import './index.css'

WebApp.ready();

const manifestUrl = 'https://sashajozwiak.github.io/ton-react/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
)
