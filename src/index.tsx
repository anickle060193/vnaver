import React from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto';
import 'typeface-roboto-mono';

import 'material-design-icons/iconfont/material-icons.css';

import 'bootstrap-css-only';

import App from './App';

ReactDOM.render(
  <App />,
  document.getElementById( 'root' ) as HTMLElement
);

if( process.env.NODE_ENV === 'development' )
{
  if( module.hot )
  {
    module.hot.accept( './App', () =>
    {
      console.log( '---------- %cAPP HOT RELOAD%c ----------', 'color: lightblue; font-weight: bold;', '' );

      ReactDOM.render(
        <App />,
        document.getElementById( 'root' ) as HTMLElement
      );
    } );
  }
}
