import undoable, { groupByActionTypes } from 'redux-undo';
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
  DraggingInfo,
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
}

const initialState: State = {
  tool: Tool.Cursor,
  scaleLevel: DEFAULT_SCALE_LEVEL,
  originX: 0.0,
  originY: 0.0,
  drawings: {},
  selectedDrawingId: null
};

const actionCreator = actionCreatorFactory();

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

const baseReducer = reducerWithInitialState( initialState )
  .case( addDrawing, ( state, drawing ) => ( {
    ...setDrawingInState( state, drawing ),
    selectedDrawingId: drawing.id
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
      selectedDrawingId
    };
  } )
  .case( updateDrawing, setDrawingInState )
  .case( moveDrawing, ( state, { drawingId, x, y } ) =>
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
        y
      } );
    }
    else if( drawing.type === DrawingType.HorizontalGridLine )
    {
      return setDrawingInState( state, {
        ...drawing,
        y
      } );
    }
    else if( drawing.type === DrawingType.VerticalGridLine )
    {
      return setDrawingInState( state, {
        ...drawing,
        x
      } );
    }
    else if( drawing.type === DrawingType.PathLine )
    {
      return state;
    }
    else
    {
      throw assertNever( drawing.type );
    }
  } );

export const reducer = undoable( baseReducer, {
  groupBy: groupByActionTypes( [ moveDrawing ].map( ( a ) => a.type ) )
} );
