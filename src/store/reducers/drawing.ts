import { reducerWithInitialState } from 'typescript-fsa-reducers';
import actionCreatorFactory from 'typescript-fsa';

import
{
  Drawing,
  Tool,
  DrawingTool,
  DrawingMap,
  DEFAULT_SCALE_LEVEL,
  MAX_SCALE_LEVEL,
  MIN_SCALE_LEVEL,
  DrawingType,
  BetweenDrawing,
  DraggingInfo
} from 'utils/draw';
import { limit, mapToArray, arrayToMap, assertNever } from 'utils/utils';

export interface State
{
  tool: DrawingTool;
  scaleLevel: number;
  originX: number;
  originY: number;
  gridOn: boolean;
  drawings: DrawingMap;
  selectedDrawingId: string | null;
}

const initialState: State = {
  tool: Tool.Cursor,
  scaleLevel: DEFAULT_SCALE_LEVEL,
  originX: 0.0,
  originY: 0.0,
  gridOn: false,
  drawings: {},
  selectedDrawingId: null
};

const actionCreator = actionCreatorFactory();

export const setTool = actionCreator<DrawingTool>( 'SET_TOOL' );
export const incrementScaleLevel = actionCreator( 'INCREMENT_SCALE_LEVEL' );
export const decrementScaleLevel = actionCreator( 'DECREMENT_SCALE_LEVEL' );
export const resetScaleLevel = actionCreator( 'RESET_SCALE_LEVEL' );
export const setOrigin = actionCreator<{ originX: number, originY: number }>( 'SET_ORIGIN' );
export const resetOrigin = actionCreator( 'RESET_ORIGIN' );
export const setGridOn = actionCreator<boolean>( 'SET_GRID_ON' );
export const addDrawing = actionCreator<Drawing>( 'ADD_DRAWING' );
export const selectDrawing = actionCreator<string>( 'SELECT_DRAWING' );
export const deselectDrawing = actionCreator( 'DESELECT_DRAWING' );
export const updateDrawing = actionCreator<Drawing>( 'UPDATE_DRAWING' );
export const deleteDrawing = actionCreator<string>( 'DELETE_DRAWING' );
export const moveDrawing = actionCreator<DraggingInfo>( 'MOVE_DRAWING' );

const setDrawingInState = <D extends Drawing>( state: State, drawing: D ): State =>
  ( {
    ...state,
    drawings: {
      ...state.drawings,
      [ drawing.id ]: drawing
    }
  } );

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
  .case( setGridOn, ( state, gridOn ) =>
    ( {
      ...state,
      gridOn
    } ) )
  .case( addDrawing, setDrawingInState )
  .case( selectDrawing, ( state, drawingId ) =>
    ( {
      ...state,
      selectedDrawingId: drawingId
    } ) )
  .case( deselectDrawing, ( state ) =>
    ( {
      ...state,
      selectedDrawingId: null
    } ) )
  .case( deleteDrawing, ( state, drawingId ) =>
  {
    let selectedDrawingId = state.selectedDrawingId;
    if( selectedDrawingId === drawingId )
    {
      selectedDrawingId = null;
    }
    let drawings = arrayToMap( mapToArray( state.drawings ).filter( ( drawing ) =>
    {
      if( drawing.id === drawingId )
      {
        return false;
      }
      if( drawing.type === DrawingType.PathLine )
      {
        if( drawing.start.connected && drawing.start.anchorId === drawingId )
        {
          return false;
        }
        else if( drawing.end.connected && drawing.end.anchorId === drawingId )
        {
          return false;
        }
      }
      return true;
    } ) );
    return {
      ...state,
      drawings,
      selectedDrawingId
    };
  } )
  .case( updateDrawing, setDrawingInState )
  .case( moveDrawing, ( state, { drawingId, drawingType, deltaX, deltaY } ) =>
  {
    let drawing = state.drawings[ drawingId ];

    if( drawing.type === DrawingType.Above
      || drawing.type === DrawingType.At
      || drawing.type === DrawingType.Below )
    {
      return setDrawingInState( state, {
        ...drawing,
        x: drawing.x + deltaX,
        y: drawing.y + deltaY,
      } );
    }
    else if( drawing.type === DrawingType.Between )
    {
      return setDrawingInState<BetweenDrawing>( state, {
        ...drawing,
        x: drawing.x + deltaX,
        y: drawing.y + deltaY,
      } );
    }
    else if( drawing.type === DrawingType.HorizontalGridLine )
    {
      return setDrawingInState( state, {
        ...drawing,
        y: drawing.y + deltaY
      } );
    }
    else if( drawing.type === DrawingType.VerticalGridLine )
    {
      return setDrawingInState( state, {
        ...drawing,
        x: drawing.x + deltaX
      } );
    }
    else if( drawing.type === DrawingType.PathLine )
    {
      return state;
    }
    else if( drawing.type === DrawingType.Plane )
    {
      return setDrawingInState( state, {
        ...drawing,
        x: drawing.x + deltaX,
        y: drawing.y + deltaY
      } );
    }
    else
    {
      throw assertNever( drawing.type );
    }
  } );
