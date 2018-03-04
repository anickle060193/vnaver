export function stateDrawings( state: RootState, documentId: string = '' )
{
  return state.documents.drawings.present;
}

export function stateEditor( state: RootState, documentId: string = '' )
{
  return state.documents.editor;
}
