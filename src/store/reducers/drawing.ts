import { reducerWithInitialState } from 'typescript-fsa-reducers';
import actionCreatorFactory from 'typescript-fsa';

import { Drawing, DrawingTool, DrawingMap } from 'utils/draw';

export interface State
{
  tool: DrawingTool | null;
  drawings: DrawingMap;
  selectedDrawing: Drawing | null;
}

const initialState: State = {
  tool: null,
  drawings: {},
  selectedDrawing: null
};

const actionCreator = actionCreatorFactory();

export const setTool = actionCreator<DrawingTool | null>( 'SET_TOOL' );
export const addDrawing = actionCreator<Drawing>( 'ADD_DRAWING' );
export const selectDrawing = actionCreator<Drawing>( 'SELECT_DRAWING' );
export const deselectDrawing = actionCreator( 'DESELECT_DRAWING' );

export const reducer = reducerWithInitialState( initialState )
  .case( setTool, ( state, tool ) =>
    ( {
      ...state,
      tool
    } ) )
  .case( addDrawing, ( state, drawing ) =>
    ( {
      ...state,
      drawings: {
        ...state.drawings,
        [ drawing.id ]: drawing
      }
    } ) )
  .case( selectDrawing, ( state, drawing ) =>
    ( {
      ...state,
      selectedDrawing: drawing
    } ) )
  .case( deselectDrawing, ( state ) =>
    ( {
      ...state,
      selectedDrawing: null
    } ) );
