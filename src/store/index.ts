import { Middleware, createStore, applyMiddleware } from 'redux';
import * as ReduxLogger from 'redux-logger';

import rootReducer from 'store/reducers';

const middleWares: Middleware[] = [];

if( process.env.NODE_ENV === 'development' )
{
  const { createLogger } = require( 'redux-logger' ) as typeof ReduxLogger;
  middleWares.unshift( createLogger( {
    collapsed: true,
    diff: true,
    duration: true
  } ) );
}

const store = createStore( rootReducer, applyMiddleware( ...middleWares ) );

if( process.env.NODE_ENV === 'development' )
{
  if( module.hot )
  {
    module.hot.accept( 'store/reducers', () =>
    {
      console.log( `---------- %cSTORE HOT RELOAD%c ----------`, 'color: red; font-weight: bold;', '' );

      store.replaceReducer( rootReducer );
    } );
  }
}

export default store;
