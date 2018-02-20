import { reducerWithInitialState } from 'typescript-fsa-reducers';
import actionCreatorFactory from 'typescript-fsa';

import { Drawing, Tool, DrawingTool, DrawingMap, DEFAULT_SCALE_LEVEL, MAX_SCALE_LEVEL, MIN_SCALE_LEVEL } from 'utils/draw';
import { limit } from 'utils/utils';

export interface State
{
  tool: DrawingTool;
  scaleLevel: number;
  originX: number;
  originY: number;
  drawings: DrawingMap;
  selectedDrawing: Drawing | null;
}

const initialState: State = {
  tool: Tool.Cursor,
  scaleLevel: DEFAULT_SCALE_LEVEL,
  originX: 0.0,
  originY: 0.0,
  drawings: {},
  selectedDrawing: null
};

const actionCreator = actionCreatorFactory();

export const setTool = actionCreator<DrawingTool>( 'SET_TOOL' );
export const incrementScaleLevel = actionCreator( 'INCREMENT_SCALE_LEVEL' );
export const decrementScaleLevel = actionCreator( 'DECREMENT_SCALE_LEVEL' );
export const resetScaleLevel = actionCreator( 'RESET_SCALE_LEVEL' );
export const setOrigin = actionCreator<{ originX: number, originY: number }>( 'SET_ORIGIN' );
export const resetOrigin = actionCreator( 'RESET_ORIGIN' );
export const addDrawing = actionCreator<Drawing>( 'ADD_DRAWING' );
export const selectDrawing = actionCreator<Drawing>( 'SELECT_DRAWING' );
export const deselectDrawing = actionCreator( 'DESELECT_DRAWING' );
export const deleteDrawing = actionCreator<Drawing>( 'DELETE_DRAWING' );

export const reducer = reducerWithInitialState( initialState )
  .case( setTool, ( state, tool ) =>
    ( {
      ...state,
      tool: tool
    } ) )
  .case( incrementScaleLevel, ( state ) =>
    ( {
      ...state,
      scaleLevel: limit( state.scaleLevel + 1, MIN_SCALE_LEVEL, MAX_SCALE_LEVEL )
    } ) )
  .case( decrementScaleLevel, ( state ) =>
    ( {
      ...state,
      scaleLevel: limit( state.scaleLevel - 1, MIN_SCALE_LEVEL, MAX_SCALE_LEVEL )
    } ) )
  .case( resetScaleLevel, ( state ) =>
    ( {
      ...state,
      scaleLevel: DEFAULT_SCALE_LEVEL
    } ) )
  .case( setOrigin, ( state, { originX, originY } ) =>
    ( {
      ...state,
      originX,
      originY
    } ) )
  .case( resetOrigin, ( state ) =>
    ( {
      ...state,
      originX: 0.0,
      originY: 0.0
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
    } ) )
  .case( deleteDrawing, ( state, drawing ) =>
  {
    let { [ drawing.id ]: _, ...drawings } = state.drawings;
    let selectedDrawing = state.selectedDrawing;
    if( selectedDrawing && selectedDrawing.id === drawing.id )
    {
      selectedDrawing = null;
    }
    return {
      ...state,
      drawings,
      selectedDrawing
    };
  } );
