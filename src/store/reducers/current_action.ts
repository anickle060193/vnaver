import { reducerWithInitialState } from 'typescript-fsa-reducers';
import actionCreatorFactory from 'typescript-fsa';

import { DrawAction } from 'utils/draw_action';

export interface State
{
  currentAction: DrawAction | null;
}

const initialState: State = {
  currentAction: null
};

const actionCreator = actionCreatorFactory();

export const setCurrentAction = actionCreator<DrawAction | null>( 'SET_CURRENT_ACTION' );

export const reducer = reducerWithInitialState( initialState )
  .case( setCurrentAction, ( state, currentAction ) =>
    ( {
      currentAction
    } ) );
