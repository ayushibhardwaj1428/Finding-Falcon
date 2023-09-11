import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { DataProvider } from './context/dataProvider';
import AppRouter from './routes';


ReactDOM.render(
  <React.StrictMode>
    <DataProvider>
      <AppRouter/>
    </DataProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

