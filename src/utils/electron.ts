import * as FsModule from 'mz/fs';

const electron = window.require( 'electron' );

import { DrawingMap } from 'utils/draw';
import { mapToArray } from 'utils/utils';
import { DrawingsParseResult, parseDrawings } from 'utils/drawing_validator';

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

export async function saveDrawingsToFile( drawings: DrawingMap, filename: string )
{
  let drawingsArray = mapToArray( drawings );
  let output = JSON.stringify( drawingsArray, null, 2 );
  await fs.writeFile( filename, output );
}

export async function saveDiagram( drawings: DrawingMap, filename: string | null )
{
  if( filename === null )
  {
    return await saveDiagramAs( drawings );
  }
  else
  {
    await saveDrawingsToFile( drawings, filename );
    return filename;
  }
}

export async function saveDiagramAs( drawings: DrawingMap )
{
  return new Promise<string | null>( ( resolve ) =>
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
          await saveDrawingsToFile( drawings, filename );
          resolve( filename );
        }
        else
        {
          resolve( null );
        }
      } );
  } );
}

interface DocumentOpenResult extends DrawingsParseResult
{
  filename: string;
}

export function openDiagram(): Promise<DocumentOpenResult | undefined>
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
      let result = parseDrawings( content );
      resolve( {
        ...result,
        filename
      } );
    }
    resolve();
  } );
}

export function launchSecret()
{
  electron.remote.getCurrentWebContents().openDevTools( { mode: 'right', } );
}

export function exit()
{
  electron.remote.app.quit();
}
