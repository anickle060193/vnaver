import * as React from 'react';
import { Provider } from 'react-redux';

import ShortcutManager from 'components/ShortcutManager';
import Layout from 'components/Layout';
import UpdateNotification from 'components/UpdateNotification';
import store from 'store';
import { createAutoUpdater } from 'utils/auto_updater';

if( process.env.NODE_ENV !== 'development' )
{
  createAutoUpdater( store );
}

export default class App extends React.Component
{
  render()
  {
    return (
      <Provider store={store}>
        <ShortcutManager>
          <Layout />
          <UpdateNotification />
        </ShortcutManager>
      </Provider>
    );
  }
}
