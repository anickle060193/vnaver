import { MenuItemConstructorOptions } from 'electron';
import { Store } from 'redux';

import { currentDrawingsState, currentDocumentInformationState } from 'store/selectors';
import { setDocumentFileName, setSaveRevision } from 'store/reducers/documentInfo';

import electron, { exportImage, showSaveDiagramDialog, showOpenDiagramDialog, showSaveDiagramAsDialog } from 'utils/electron';
import { openDiagram } from 'utils/document';

async function onOpenDiagram( store: Store<RootState> )
{
  let result = await showOpenDiagramDialog();
  if( result )
  {
    openDiagram( store, result );
  }
}

async function onSaveDiagram( store: Store<RootState> )
{
  let state = store.getState();
  let drawingsState = currentDrawingsState( state );
  let drawings = drawingsState.drawings;
  let filename = currentDocumentInformationState( state ).filename;

  let newFilename = await showSaveDiagramDialog( drawings, filename );

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

  let filename = await showSaveDiagramAsDialog( drawings );

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
