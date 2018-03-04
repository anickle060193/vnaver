import { combineReducers } from 'redux';
import { StateWithHistory } from 'redux-undo';

import { State as DrawingsState, reducer as drawingsReducer } from 'store/reducers/drawings';
import { State as EditorState, reducer as editorReducer } from 'store/reducers/editor';

export interface State
{
  drawings: StateWithHistory<DrawingsState>;
  editor: EditorState;
}

export const reducer = combineReducers<RootState>( {
  drawings: drawingsReducer,
  editor: editorReducer
} );
