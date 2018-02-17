export async function createBitmapFromSrc( src: string )
{
  let bitmap = await new Promise( ( resolve, reject ) =>
  {
    let image = new Image();

    image.addEventListener( 'load', () =>
    {
      resolve( createImageBitmap( image ) );
    } );

    image.addEventListener( 'error', ( error ) =>
    {
      reject( error );
    } );

    image.src = src;
  } );
  return bitmap as ImageBitmap;
}
