import undoable, { groupByActionTypes, excludeAction } from 'redux-undo';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import actionCreatorFactory from 'typescript-fsa';

import
{
  Drawing,
  Tool,
  DrawingTool,
  DrawingMap,
  DEFAULT_SCALE_LEVEL,
  DrawingType,
  getEndPointPosition
} from 'utils/draw';
import { mapToArray, arrayToMap, assertNever } from 'utils/utils';

export interface State
{
  tool: DrawingTool;
  scaleLevel: number;
  originX: number;
  originY: number;
  drawings: DrawingMap;
  selectedDrawingId: string | null;
  revision: number;
}

const initialState: State = {
  tool: Tool.Cursor,
  scaleLevel: DEFAULT_SCALE_LEVEL,
  originX: 0.0,
  originY: 0.0,
  drawings: {},
  selectedDrawingId: null,
  revision: 0
};

const actionCreator = actionCreatorFactory();

export const addDrawing = actionCreator<Drawing>( 'ADD_DRAWING' );
export const selectDrawing = actionCreator<string>( 'SELECT_DRAWING' );
export const deselectDrawing = actionCreator( 'DESELECT_DRAWING' );
export const updateDrawing = actionCreator<Drawing>( 'UPDATE_DRAWING' );
export const deleteDrawing = actionCreator<string>( 'DELETE_DRAWING' );
export const moveDrawing = actionCreator<{ drawingId: string, xDelta: number, yDelta: number }>( 'MOVE_DRAWING' );
export const setDrawingPosition = actionCreator<{ drawingId: string, x: number, y: number }>( 'SET_DRAWING_POSITION' );
export const setDrawings = actionCreator<DrawingMap>( 'SET_DRAWINGS' );

const setDrawingInState = <D extends Drawing>( state: State, drawing: D ): State =>
  ( {
    ...state,
    drawings: {
      ...state.drawings,
      [ drawing.id ]: drawing
    }
  } );

const baseReducer = reducerWithInitialState( initialState )
  .case( addDrawing, ( state, drawing ) => ( {
    ...setDrawingInState( state, drawing ),
    selectedDrawingId: drawing.id,
    revision: state.revision + 1
  } ) )
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
    let drawings = mapToArray( state.drawings );

    if( selectedDrawingId === drawingId )
    {
      selectedDrawingId = null;
    }

    drawings = drawings.map( ( drawing ) =>
    {
      if( drawing.type === DrawingType.PathLine )
      {
        if( drawing.start.connected && drawing.start.anchorId === drawingId )
        {
          let start = getEndPointPosition( drawing.start, state.drawings );
          drawing = {
            ...drawing,
            start: {
              connected: false,
              x: start.x,
              y: start.y
            }
          };
        }

        if( drawing.end.connected && drawing.end.anchorId === drawingId )
        {
          let end = getEndPointPosition( drawing.end, state.drawings );
          drawing = {
            ...drawing,
            end: {
              connected: false,
              x: end.x,
              y: end.y
            }
          };
        }
      }

      return drawing;
    } );

    return {
      ...state,
      drawings: arrayToMap( drawings.filter( ( drawing ) => drawing.id !== drawingId ) ),
      selectedDrawingId,
      revision: state.revision + 1
    };
  } )
  .case( updateDrawing, ( state, drawing ) => ( {
    ...setDrawingInState( state, {
      ...drawing
    } ),
    revision: state.revision + 1
  } ) )
  .case( moveDrawing, ( state, { drawingId, xDelta, yDelta } ) =>
  {
    let drawing = state.drawings[ drawingId ];

    if( drawing.type === DrawingType.Above
      || drawing.type === DrawingType.At
      || drawing.type === DrawingType.Below
      || drawing.type === DrawingType.Between
      || drawing.type === DrawingType.Plane
      || drawing.type === DrawingType.Text )
    {
      return setDrawingInState( state, {
        ...drawing,
        x: drawing.x + xDelta,
        y: drawing.y + yDelta,
        revision: state.revision + 1
      } );
    }
    else if( drawing.type === DrawingType.HorizontalGridLine )
    {
      return setDrawingInState( state, {
        ...drawing,
        y: drawing.y + yDelta,
        revision: state.revision + 1
      } );
    }
    else if( drawing.type === DrawingType.VerticalGridLine )
    {
      return setDrawingInState( state, {
        ...drawing,
        x: drawing.x + xDelta,
        revision: state.revision + 1
      } );
    }
    else if( drawing.type === DrawingType.PathLine
      || drawing.type === DrawingType.CurvedLine )
    {
      return state;
    }
    else
    {
      throw assertNever( drawing.type );
    }
  } )
  .case( setDrawingPosition, ( state, { drawingId, x, y } ) =>
  {
    let drawing = state.drawings[ drawingId ];

    if( drawing.type === DrawingType.Above
      || drawing.type === DrawingType.At
      || drawing.type === DrawingType.Below
      || drawing.type === DrawingType.Between
      || drawing.type === DrawingType.Plane
      || drawing.type === DrawingType.Text )
    {
      return setDrawingInState( state, {
        ...drawing,
        x,
        y,
        revision: state.revision + 1
      } );
    }
    else if( drawing.type === DrawingType.HorizontalGridLine )
    {
      return setDrawingInState( state, {
        ...drawing,
        y,
        revision: state.revision + 1
      } );
    }
    else if( drawing.type === DrawingType.VerticalGridLine )
    {
      return setDrawingInState( state, {
        ...drawing,
        x,
        revision: state.revision + 1
      } );
    }
    else if( drawing.type === DrawingType.PathLine
      || drawing.type === DrawingType.CurvedLine )
    {
      return state;
    }
    else
    {
      throw assertNever( drawing.type );
    }
  } )
  .case( setDrawings, ( state, drawings ) =>
  {
    return {
      ...state,
      drawings,
      selectedDrawingId: null,
      revision: 0
    };
  } );

export const reducer = undoable( baseReducer, {
  groupBy: groupByActionTypes( [ moveDrawing, setDrawingPosition ].map( ( a ) => a.type ) ),
  filter: excludeAction( [ setDrawings ].map( ( a ) => a.type ) )
} );
