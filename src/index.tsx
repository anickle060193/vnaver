import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'typeface-roboto';

import App from './App';

import './index.css';

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
      console.log( `---------- %cAPP HOT RELOAD%c ----------`, 'color: blue; font-weight: bold;', '' );

      ReactDOM.render(
        <App />,
        document.getElementById( 'root' ) as HTMLElement
      );
    } );
  }
}
