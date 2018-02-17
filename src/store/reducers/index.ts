import { combineReducers } from 'redux';

import { State as DrawingState, reducer as drawingReducer } from 'store/reducers/drawing';

declare global
{
  interface RootState
  {
    drawing: DrawingState;
  }
}

export default combineReducers<RootState>( {
  drawing: drawingReducer
} );
