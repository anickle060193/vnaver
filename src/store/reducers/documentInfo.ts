import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';

export interface State
{
  filename: string | null;
  saveRevision: number | null;
}

const initialState: State = {
  filename: null,
  saveRevision: null
};

const actionCreator = actionCreatorFactory();

export const setDocumentFileName = actionCreator<string>( 'SET_DOCUMENT_FILENAME' );
export const setSaveRevision = actionCreator<number>( 'SET_SAVE_REVISION' );

export const reducer = reducerWithInitialState( initialState )
  .case( setDocumentFileName, ( state, filename ) =>
    ( {
      ...state,
      filename
    } ) )
  .case( setSaveRevision, ( state, saveRevision ) =>
    ( {
      ...state,
      saveRevision
    } ) );
