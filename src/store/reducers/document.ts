import { combineReducers } from 'redux';
import { StateWithHistory } from 'redux-undo';

import { State as DrawingsState, reducer as drawingsReducer } from 'store/reducers/drawings';
import { State as EditorState, reducer as editorReducer } from 'store/reducers/editor';
import { State as DocumentInfoState, reducer as documentInfoReducer } from 'store/reducers/documentInfo';

export interface State
{
  drawings: StateWithHistory<DrawingsState>;
  editor: EditorState;
  info: DocumentInfoState;
}

export const reducer = combineReducers<State>( {
  drawings: drawingsReducer,
  editor: editorReducer,
  info: documentInfoReducer
} );
