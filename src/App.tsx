import React from 'react';
import { Provider } from 'react-redux';

import ShortcutManager from 'components/ShortcutManager';
import Layout from 'components/Layout';
import UpdateNotification from 'components/UpdateNotification';
import SettingsDialog from 'components/SettingsDialog';
import DiagramOpenErrorsDialog from 'components/DiagramOpenErrorsDialog';

import store from 'store';

import { createAutoUpdater } from 'utils/auto_updater';
import { createApplicationMenu } from 'utils/menu';
import { openCommandLineFile } from 'utils/electron';

if( process.env.NODE_ENV !== 'development' )
{
  createAutoUpdater( store );
}

createApplicationMenu( store );

openCommandLineFile( store );

const App: React.SFC = () =>
{
  return (
    <Provider store={store}>
      <ShortcutManager>
        <Layout />
        <UpdateNotification />
        <SettingsDialog />
        <DiagramOpenErrorsDialog />
      </ShortcutManager>
    </Provider>
  );
};

export default App;
