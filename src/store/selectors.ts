import { State as DocumentState } from 'store/reducers/document';

export function currentDrawingsState( state: RootState )
{
  return state.documents.docs[ state.documents.currentDocumentId ].drawings.present;
}

export function currentEditorState( state: RootState )
{
  return state.documents.docs[ state.documents.currentDocumentId ].editor;
}

export type DocumentAttributeMap<T> = { [ documentId: string ]: T };

function getDocumentsAttribute<T>( state: RootState, getItem: ( document: DocumentState ) => T )
{
  return Object.entries( state.documents.docs ).reduce( ( prev, [ documentId, document ] ) =>
  {
    prev[ documentId ] = getItem( document );
    return prev;
  }, {} as { [ documentId: string ]: T } );
}

export function documentFilenames( state: RootState )
{
  return getDocumentsAttribute( state, ( doc ) => doc.info.filename );
}

export function documentModifieds( state: RootState )
{
  return getDocumentsAttribute( state, ( doc ) => doc.drawings.present.modified );
}
