import * as FsModule from 'mz/fs';

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
  }, async ( filename: string ) =>
    {
      console.log( 'Exporting to:', filename );

      let data = canvas.toDataURL( 'image/png' );
      let image = electron.nativeImage.createFromDataURL( data );
      let buffer = image.toPNG();

      await fs.writeFile( filename, buffer );
    } );
}
