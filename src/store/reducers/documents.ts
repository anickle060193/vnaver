import { Reducer, Action } from 'redux';
import { actionCreatorFactory } from 'typescript-fsa';
import uuid from 'uuid/v4';

import { State as DocumentState, reducer as documentReducer } from 'store/reducers/document';
import { limit } from 'utils/utils';

interface DocumentStateMap
{
  [ documentId: string ]: DocumentState;
}

const initDocument = () => documentReducer( undefined!, { type: '' } );

export interface State
{
  currentDocumentId: string;
  order: string[];
  docs: DocumentStateMap;
}

const initialState: State = ( () =>
{
  let startUpDocumentId = uuid();
  return {
    currentDocumentId: startUpDocumentId,
    order: [ startUpDocumentId ],
    docs: {
      [ startUpDocumentId ]: initDocument()
    }
  };
} )();

const actionCreator = actionCreatorFactory();

export const setCurrentDocument = actionCreator<string>( 'SET_CURRENT_DOCUMENT' );
export const addDocument = actionCreator( 'ADD_DOCUMENT' );
export const swapDocuments = actionCreator<[ string, string ]>( 'SWAP_DOCUMENTS' );
export const closeDocument = actionCreator<string>( 'CLOSE_DOCUMENT' );

export const reducer: Reducer<State> = ( state = initialState, action: Action ) =>
{
  if( setCurrentDocument.match( action ) )
  {
    return {
      ...state,
      currentDocumentId: action.payload
    };
  }
  else if( addDocument.match( action ) )
  {
    let documentId = uuid();
    return {
      ...state,
      currentDocumentId: documentId,
      order: [ ...state.order, documentId ],
      docs: {
        ...state.docs,
        [ documentId ]: initDocument()
      }
    };
  }
  else if( swapDocuments.match( action ) )
  {
    let [ docA, docB ] = action.payload;

    let order = [ ...state.order ];
    let aIndex = order.indexOf( docA );
    let bIndex = order.indexOf( docB );

    if( aIndex === -1 || bIndex === -1 )
    {
      console.warn( 'Could not find document to swap:', docA, docB );
      return state;
    }

    order[ bIndex ] = docA;
    order[ aIndex ] = docB;

    return {
      ...state,
      order
    };
  }
  else if( closeDocument.match( action ) )
  {
    let documentId = action.payload;

    let order = [ ...state.order ];
    let documentIndex = order.indexOf( documentId );
    if( documentIndex !== -1 )
    {
      order.splice( documentIndex, 1 );
    }

    let docs = { ...state.docs };
    delete docs[ documentId ];

    let currentDocumentId = state.currentDocumentId;
    if( currentDocumentId === documentId )
    {
      if( order.length === 0 )
      {
        throw new Error( 'Attempting to remove last document.' );
      }
      else if( documentIndex !== -1 )
      {
        let index = limit( documentIndex, 0, order.length - 1 );
        currentDocumentId = order[ index ];
      }
      else
      {
        currentDocumentId = order[ 0 ];
      }
    }
    return {
      ...state,
      currentDocumentId,
      order,
      docs
    };
  }
  else
  {
    return {
      ...state,
      docs: {
        ...state.docs,
        [ state.currentDocumentId ]: documentReducer( state.docs[ state.currentDocumentId ], action )
      }
    };
  }
};
