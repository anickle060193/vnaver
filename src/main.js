// @ts-check

const { app, BrowserWindow } = require( 'electron' );
// const { autoUpdater } = require( 'electron-updater' );
const path = require( 'path' );
const url = require( 'url' );

/** @type {BrowserWindow | null} */
let window = null;

function createWindow()
{
  window = new BrowserWindow( {
    width: 800,
    height: 600,
    show: false,
    backgroundColor: "#f5f5f5"
  } );

  window.loadURL(
    process.env.NODE_ENV === 'development' ?
      'http://localhost:3000'
      :
      url.format( {
        pathname: path.join( __dirname, '/../build/index.html' ),
        protocol: 'file',
        slashes: true
      } )
  );

  window.on( 'closed', () =>
  {
    window = null;
  } );

  window.once( 'ready-to-show', () =>
  {
    if( window )
    {
      window.show();
    }
  } );
}

app.on( 'ready', () =>
{
  // autoUpdater.checkForUpdatesAndNotify();
  createWindow();
} );

app.on( 'window-all-closed', () =>
{
  if( process.platform !== 'darwin' )
  {
    app.quit();
  }
} );

app.on( 'activate', () =>
{
  if( window === null )
  {
    createWindow();
  }
} );
