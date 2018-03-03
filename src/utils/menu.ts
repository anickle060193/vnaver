import { MenuItemConstructorOptions } from 'electron';
import { Store } from 'redux';

import { setDrawings } from 'store/reducers/drawings';
import electron, { openDiagram, saveDiagram, exportImage } from 'utils/electron';
import { arrayToMap } from 'utils/utils';

async function onOpenDiagram( store: Store<RootState> )
{
  let result = await openDiagram();
  if( result && result.drawings )
  {
    let drawings = arrayToMap( result.drawings );
    store.dispatch( setDrawings( drawings ) );
  }
}

function onSaveDiagram( store: Store<RootState> )
{
  saveDiagram( store.getState().drawings.present.drawings );
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
