import { Store } from 'redux';
import fs from 'mz/fs';

import { DrawingMap } from 'utils/draw';
import { mapToArray } from 'utils/utils';
import { DrawingsParseResult, parseDrawings } from 'utils/drawing_validator';
import { openDiagram } from 'utils/document';

const electron = window.require( 'electron' );

export default electron;

async function isValidDiagramFilename( filename: string )
{
  return filename
    && ( filename.endsWith( '.vnav' )
      || filename.endsWith( '.json' ) )
    && fs.exists( filename );
}

export async function openCommandLineFile( store: Store<RootState> )
{
  if( electron.remote.process )
  {
    let commandLineArgs: string[] = electron.remote.process.argv;
    for( let arg of commandLineArgs.slice( 1 ) )
    {
      if( await isValidDiagramFilename( arg ) )
      {
        console.log( 'Opening command line file:', arg );
        let result = await readDiagramFile( arg );
        openDiagram( store, result );
      }
    }
  }
}

export async function exportImage( canvas: HTMLCanvasElement )
{
  const { filePath } = await electron.remote.dialog.showSaveDialog( electron.remote.getCurrentWindow(), {
    title: 'Export image...',
    filters: [
      { name: 'PNG Images', extensions: [ 'png' ] }
    ]
  } );

  if( filePath )
  {
    console.log( 'Exporting to:', filePath );

    let data = canvas.toDataURL( 'image/png' );
    let image = electron.nativeImage.createFromDataURL( data );
    let buffer = image.toPNG();

    await fs.writeFile( filePath, buffer );
  }
}

export async function saveDrawingsToFile( drawings: DrawingMap, filename: string )
{
  let drawingsArray = mapToArray( drawings );
  let output = JSON.stringify( drawingsArray, null, 2 );
  await fs.writeFile( filename, output );
}

export async function showSaveDiagramDialog( drawings: DrawingMap, filename: string | null )
{
  if( filename === null )
  {
    return showSaveDiagramAsDialog( drawings );
  }
  else
  {
    await saveDrawingsToFile( drawings, filename );
    return filename;
  }
}

export async function showSaveDiagramAsDialog( drawings: DrawingMap )
{
  const { filePath } = await electron.remote.dialog.showSaveDialog( electron.remote.getCurrentWindow(), {
    title: 'Save Diagram',
    filters: [
      { name: 'VNAVer Document', extensions: [ 'vnav' ] },
      { name: 'JSON Files', extensions: [ 'json' ] }
    ]
  } );

  if( filePath )
  {
    await saveDrawingsToFile( drawings, filePath );
    return filePath;
  }
  else
  {
    return null;
  }
}

export interface DocumentOpenResult extends DrawingsParseResult
{
  filename: string;
}

export async function readDiagramFile( filename: string ): Promise<DocumentOpenResult>
{
  let contentBuffer = await fs.readFile( filename );
  let content = contentBuffer.toString();
  return {
    ...parseDrawings( content ),
    filename
  };
}

export async function showOpenDiagramDialog(): Promise<DocumentOpenResult | null>
{
  const { filePaths } = await electron.remote.dialog.showOpenDialog( electron.remote.getCurrentWindow(), {
    title: 'Open Diagram',
    filters: [
      { name: 'VNAVer Document', extensions: [ 'vnav' ] },
      { name: 'JSON Files', extensions: [ 'json' ] }
    ],
    properties: [ 'openFile' ]
  } );

  if( filePaths && filePaths.length )
  {
    let filename = filePaths[ 0 ];
    console.log( 'Opening diagram:', filename );

    return readDiagramFile( filename );
  }

  return null;
}

export function launchSecret()
{
  electron.remote.getCurrentWebContents().openDevTools( { mode: 'right', } );
}

export function exit()
{
  electron.remote.app.quit();
}
