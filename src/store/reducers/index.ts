import { combineReducers } from 'redux';

import { State as DrawingState, reducer as drawingReducer } from 'store/reducers/drawing';
import { State as UpdaterState, reducer as updaterReducer } from 'store/reducers/updater';

declare global
{
  interface RootState
  {
    drawing: DrawingState;
    updater: UpdaterState;
  }
}

export default combineReducers<RootState>( {
  drawing: drawingReducer,
  updater: updaterReducer
} );
