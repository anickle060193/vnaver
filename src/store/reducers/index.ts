import { combineReducers } from 'redux';
import { StateWithHistory } from 'redux-undo';

import { State as DrawingsState, reducer as drawingsReducer } from 'store/reducers/drawings';
import { State as EditorState, reducer as editorReducer } from 'store/reducers/editor';
import { State as UpdaterState, reducer as updaterReducer } from 'store/reducers/updater';
import { State as SettingsState, reducer as settingsReducer } from 'store/reducers/settings';

declare global
{
  interface RootState
  {
    drawings: StateWithHistory<DrawingsState>;
    editor: EditorState;
    updater: UpdaterState;
    settings: SettingsState;
  }
}

export default combineReducers<RootState>( {
  drawings: drawingsReducer,
  editor: editorReducer,
  updater: updaterReducer,
  settings: settingsReducer
} );
