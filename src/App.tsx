import * as React from 'react';
import { Provider } from 'react-redux';

import ShortcutManager from 'components/ShortcutManager';
import Layout from 'components/Layout';
import store from 'store';

export default class App extends React.Component
{
  render()
  {
    return (
      <Provider store={store}>
        <ShortcutManager>
          <Layout />
        </ShortcutManager>
      </Provider>
    );
  }
}
