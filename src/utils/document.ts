import { Store } from 'redux';
import { ActionCreators } from 'redux-undo';

import { currentDocumentInformationState, currentDrawingsState } from 'store/selectors';
import { addDocument } from 'store/reducers/documents';
import { setDocumentFileName, setSaveRevision } from 'store/reducers/documentInfo';
import { setDrawings } from 'store/reducers/drawings';
import { setDiagramOpenErrors } from 'store/reducers/editor';

import { DocumentOpenResult } from 'utils/electron';

export function openDiagram( store: Store<RootState>, result: DocumentOpenResult )
{
  let state = store.getState();
  let documentInfo = currentDocumentInformationState( state );
  let currentRevision = currentDrawingsState( state ).revision;
  if( documentInfo.filename !== null
    || documentInfo.saveRevision !== null
    || currentRevision !== 0 )
  {
    store.dispatch( addDocument() );
  }

  store.dispatch( setDocumentFileName( result.filename ) );

  if( result && result.drawings )
  {
    store.dispatch( setDrawings( result.drawings ) );
  }
  if( result && result.errors )
  {
    store.dispatch( setDiagramOpenErrors( result.errors ) );
  }

  let updatedState = store.getState();
  let revision = currentDrawingsState( updatedState ).revision;
  store.dispatch( setSaveRevision( revision ) );

  store.dispatch( ActionCreators.clearHistory() );
}
