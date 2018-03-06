import { MenuItemConstructorOptions } from 'electron';
import { Store } from 'redux';

import { setDrawings } from 'store/reducers/drawings';
import { setDiagramOpenErrors } from 'store/reducers/editor';
import { currentDrawingsState } from 'store/selectors';
import electron, { openDiagram, saveDiagram, exportImage } from 'utils/electron';
import { addDocument } from 'store/reducers/documents';
import { setDocumentFileName } from 'store/reducers/documentInfo';

async function onOpenDiagram( store: Store<RootState> )
{
  let result = await openDiagram();
  if( result )
  {
    store.dispatch( addDocument() );
    store.dispatch( setDocumentFileName( result.filename ) );

    if( result && result.drawings )
    {
      store.dispatch( setDrawings( result.drawings ) );
    }
    if( result && result.errors )
    {
      store.dispatch( setDiagramOpenErrors( result.errors ) );
    }
  }
}

function onSaveDiagram( store: Store<RootState> )
{
  saveDiagram( currentDrawingsState( store.getState() ).drawings );
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
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => onOpenDiagram( store )
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+S',
          click: () => onSaveDiagram( store )
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
