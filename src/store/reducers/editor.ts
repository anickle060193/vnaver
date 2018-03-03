import { reducerWithInitialState } from 'typescript-fsa-reducers';
import actionCreatorFactory from 'typescript-fsa';

import
{
  Tool,
  DrawingTool,
  DEFAULT_SCALE_LEVEL,
  MAX_SCALE_LEVEL,
  MIN_SCALE_LEVEL
} from 'utils/draw';
import { limit } from 'utils/utils';

export interface State
{
  tool: DrawingTool;
  scaleLevel: number;
  originX: number;
  originY: number;
  selectedDrawingId: string | null;
  diagramOpenErrors: string[] | null;
}

const initialState: State = {
  tool: Tool.Cursor,
  scaleLevel: DEFAULT_SCALE_LEVEL,
  originX: 0.0,
  originY: 0.0,
  selectedDrawingId: null,
  diagramOpenErrors: null
};

const actionCreator = actionCreatorFactory();

export const setTool = actionCreator<DrawingTool>( 'SET_TOOL' );
export const incrementScaleLevel = actionCreator( 'INCREMENT_SCALE_LEVEL' );
export const decrementScaleLevel = actionCreator( 'DECREMENT_SCALE_LEVEL' );
export const resetScaleLevel = actionCreator( 'RESET_SCALE_LEVEL' );
export const setOrigin = actionCreator<{ originX: number, originY: number }>( 'SET_ORIGIN' );
export const resetOrigin = actionCreator( 'RESET_ORIGIN' );
export const setDiagramOpenErrors = actionCreator<string[]>( 'SET_DIAGRAM_OPEN_ERRORS' );
export const clearDiagramOpenErrors = actionCreator( 'CLEAR_DIAGRAM_OPEN_ERRORS' );

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
  .case( setDiagramOpenErrors, ( state, diagramOpenErrors ) =>
    ( {
      ...state,
      diagramOpenErrors
    } ) )
  .case( clearDiagramOpenErrors, ( state ) =>
    ( {
      ...state,
      diagramOpenErrors: null
    } ) );
