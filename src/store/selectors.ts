export function currentDrawingsState( state: RootState )
{
  return state.documents.docs[ state.documents.currentDocumentId ].drawings.present;
}

export function currentEditorState( state: RootState )
{
  return state.documents.docs[ state.documents.currentDocumentId ].editor;
}

export function documentNames( state: RootState )
{
  return Object.entries( state.documents.docs ).reduce( ( prev, [ documentId, document ] ) =>
  {
    prev[ documentId ] = document.info.name;
    return prev;
  }, {} as { [ documentId: string ]: string } );
}
