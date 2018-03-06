import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';

export interface State
{
  filename: string;
}

const initialState: State = {
  filename: 'untitled'
};

const actionCreator = actionCreatorFactory();

export const setDocumentFileName = actionCreator<string>( 'SET_DOCUMENT_FILENAME' );

export const reducer = reducerWithInitialState( initialState )
  .case( setDocumentFileName, ( state, filename ) =>
    ( {
      ...state,
      filename
    } ) );
