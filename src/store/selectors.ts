import { State as DocumentState } from 'store/reducers/document';

export function currentDrawingsState( state: RootState )
{
  if( !state.documents.currentDocumentId )
  {
    throw new Error( 'Current document is null. Cannot retrieve drawings state.' );
  }
  return state.documents.docs[ state.documents.currentDocumentId ].drawings.present;
}

export function currentEditorState( state: RootState )
{
  if( !state.documents.currentDocumentId )
  {
    throw new Error( 'Current document is null. Cannot retrieve editor state.' );
  }
  return state.documents.docs[ state.documents.currentDocumentId ].editor;
}

export function currentDocumentInformationState( state: RootState )
{
  if( !state.documents.currentDocumentId )
  {
    throw new Error( 'Current document is null. Cannot retrieve document state.' );
  }
  return state.documents.docs[ state.documents.currentDocumentId ].info;
}

export interface DocumentAttributeMap<T>
{
  [ documentId: string ]: T;
}

function selectDocumentsAttribute<T>( state: RootState, getItem: ( document: DocumentState ) => T )
{
  return Object.entries( state.documents.docs ).reduce<DocumentAttributeMap<T>>( ( prev, [ documentId, document ] ) =>
  {
    prev[ documentId ] = getItem( document );
    return prev;
  }, {} );
}

export function selectDocumentFilenames( state: RootState )
{
  return selectDocumentsAttribute( state, ( doc ) => doc.info.filename );
}

export function selectDocumentSaveRevisions( state: RootState )
{
  return selectDocumentsAttribute( state, ( doc ) => doc.info.saveRevision );
}

export function selectDocumentCurrentRevision( state: RootState )
{
  return selectDocumentsAttribute( state, ( doc ) => doc.drawings.present.revision );
}
