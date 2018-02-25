import { combineReducers } from 'redux';

import { State as DrawingState, reducer as drawingReducer } from 'store/reducers/drawing';
import { State as UpdaterState, reducer as updaterReducer } from 'store/reducers/updater';
import { State as SettingsState, reducer as settingsReducer } from 'store/reducers/settings';

declare global
{
  interface RootState
  {
    drawing: DrawingState;
    updater: UpdaterState;
    settings: SettingsState;
  }
}

export default combineReducers<RootState>( {
  drawing: drawingReducer,
  updater: updaterReducer,
  settings: settingsReducer
} );
