import * as FsModule from 'mz/fs';

import { DrawingMap } from 'utils/draw';
import { mapToArray } from 'utils/utils';

const electron = window.require( 'electron' );

const fs = electron.remote.require( 'mz/fs' ) as typeof FsModule;

export default electron;

export function exportImage( canvas: HTMLCanvasElement )
{
  electron.remote.dialog.showSaveDialog( electron.remote.getCurrentWindow(), {
    title: 'Export image...',
    filters: [
      { name: 'PNG Images', extensions: [ 'png' ] }
    ]
  }, async ( filename: string | null ) =>
    {
      if( filename )
      {
        console.log( 'Exporting to:', filename );

        let data = canvas.toDataURL( 'image/png' );
        let image = electron.nativeImage.createFromDataURL( data );
        let buffer = image.toPNG();

        await fs.writeFile( filename, buffer );
      }
    } );
}

export function saveDiagram( drawings: DrawingMap )
{
  electron.remote.dialog.showSaveDialog( electron.remote.getCurrentWindow(), {
    title: 'Save Diagram',
    filters: [
      { name: 'JSON Files', extensions: [ 'json' ] }
    ]
  }, async ( filename: string | null ) =>
    {
      if( filename )
      {
        let drawingsArray = mapToArray( drawings );
        let output = JSON.stringify( drawingsArray, null, 2 );
        await fs.writeFile( filename, output );
      }
    } );
}

export function openDiagram(): Promise<string | undefined>
{
  return new Promise( async ( resolve ) =>
  {
    let filenames = electron.remote.dialog.showOpenDialog( electron.remote.getCurrentWindow(), {
      title: 'Open Diagram',
      filters: [
        { name: 'JSON Files', extensions: [ 'json' ] }
      ],
      properties: [ 'openFile' ]
    } );

    if( filenames && filenames.length )
    {
      let filename = filenames[ 0 ];
      console.log( 'Opening diagram:', filename );

      let contentBuffer = await fs.readFile( filename );
      let content = contentBuffer.toString();
      resolve( content );
    }
    resolve();
  } );
}

export function launchSecret()
{
  electron.remote.getCurrentWebContents().openDevTools( { mode: 'right', } );
}
