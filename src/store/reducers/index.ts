import { combineReducers } from 'redux';

import { State as DocumentsState, reducer as documentsReducer } from 'store/reducers/documents';
import { State as UpdaterState, reducer as updaterReducer } from 'store/reducers/updater';
import { State as SettingsState, reducer as settingsReducer } from 'store/reducers/settings';

declare global
{
  interface RootState
  {
    documents: DocumentsState;
    updater: UpdaterState;
    settings: SettingsState;
  }
}

export default combineReducers<RootState>( {
  documents: documentsReducer,
  updater: updaterReducer,
  settings: settingsReducer
} );
