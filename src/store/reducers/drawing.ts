import { reducerWithInitialState } from 'typescript-fsa-reducers';
import actionCreatorFactory from 'typescript-fsa';

import { Tool, Drawing } from 'utils/draw';

export interface State
{
  tool: Tool | null;
  drawings: Drawing[];
}

const initialState: State = {
  tool: null,
  drawings: []
};

const actionCreator = actionCreatorFactory();

export const setTool = actionCreator<Tool | null>( 'SET_TOOL' );
export const addDrawing = actionCreator<Drawing>( 'ADD_DRAWING' );

export const reducer = reducerWithInitialState( initialState )
  .case( setTool, ( state, tool ) =>
    ( {
      ...state,
      tool
    } ) )
  .case( addDrawing, ( state, drawing ) =>
    ( {
      ...state,
      drawings: state.drawings.concat( drawing )
    } ) );
