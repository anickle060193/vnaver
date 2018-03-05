// import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';

export interface State
{
  name: string;
}

const initialState: State = {
  name: 'untitled'
};

// const actionCreator = actionCreatorFactory();

export const reducer = reducerWithInitialState( initialState );
