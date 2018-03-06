import { MenuItemConstructorOptions } from 'electron';
import { Store } from 'redux';
import { ActionCreators } from 'redux-undo';

import { setDrawings } from 'store/reducers/drawings';
import { setDiagramOpenErrors } from 'store/reducers/editor';
import { currentDrawingsState, currentDocumentInformationState } from 'store/selectors';
import electron, { openDiagram, saveDiagramAs, exportImage, saveDiagram } from 'utils/electron';
import { addDocument } from 'store/reducers/documents';
import { setDocumentFileName, setSaveRevision } from 'store/reducers/documentInfo';

async function onOpenDiagram( store: Store<RootState> )
{
  let result = await openDiagram();
  if( result )
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
}

async function onSaveDiagram( store: Store<RootState> )
{
  let state = store.getState();
  let drawingsState = currentDrawingsState( state );
  let drawings = drawingsState.drawings;
  let filename = currentDocumentInformationState( state ).filename;

  let newFilename = await saveDiagram( drawings, filename );

  if( newFilename !== null )
  {
    store.dispatch( setSaveRevision( drawingsState.revision ) );

    if( newFilename !== filename )
    {
      store.dispatch( setDocumentFileName( newFilename ) );
    }
  }
}

async function onSaveDiagramAs( store: Store<RootState> )
{
  let state = store.getState();
  let drawingsState = currentDrawingsState( state );
  let drawings = drawingsState.drawings;

  let filename = await saveDiagramAs( drawings );

  if( filename !== null )
  {
    store.dispatch( setSaveRevision( drawingsState.revision ) );
    store.dispatch( setDocumentFileName( filename ) );
  }
}

function onExportImage()
{
  let canvas = document.querySelector( 'canvas' ) as HTMLCanvasElement;
  if( canvas )
  {
    exportImage( canvas );
  }
}

export function createApplicationMenu( store: Store<RootState> )
{
  let menu: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N'
        },
        { type: 'separator' },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => onOpenDiagram( store )
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => onSaveDiagram( store )
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => onSaveDiagramAs( store )
        },
        {
          label: 'Export as Image',
          click: () => onExportImage()
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }
  ];

  if( process.env.NODE_ENV === 'development' )
  {
    menu.push( {
      label: 'Developer',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' }
      ]
    } );
  }

  electron.remote.Menu.setApplicationMenu( electron.remote.Menu.buildFromTemplate( menu ) );
}
