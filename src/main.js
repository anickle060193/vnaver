// @ts-check

const { app, BrowserWindow, ipcMain } = require( 'electron' );
const log = require( 'electron-log' );
const { autoUpdater } = require( 'electron-updater' );
const path = require( 'path' );
const url = require( 'url' );

/** @type {BrowserWindow | null} */
let window = null;

log.transports.file.level = 'info';

log.info( 'App starting...' );

function setupAutoUpdater()
{
  autoUpdater.logger = log;

  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on( 'checking-for-update', () =>
  {
    if( window )
    {
      window.webContents.send( 'checking-for-update' );
    }
  } );

  autoUpdater.on( 'update-available', ( updateInfo ) =>
  {
    if( window )
    {
      window.webContents.send( 'update-available', updateInfo );
    }
  } );

  autoUpdater.on( 'update-not-available', ( updateInfo ) =>
  {
    if( window )
    {
      window.webContents.send( 'update-not-available', updateInfo );
    }
  } );

  autoUpdater.on( 'error', ( error ) =>
  {
    if( window )
    {
      window.webContents.send( 'error', error );
    }
  } );

  autoUpdater.on( 'download-progress', ( progress ) =>
  {
    if( window )
    {
      window.webContents.send( 'download-progress', progress );
    }
  } );

  autoUpdater.on( 'update-downloaded', ( updateInfo ) =>
  {
    if( window )
    {
      window.webContents.send( 'update-downloaded', updateInfo );
    }
  } );

  ipcMain.on( 'quit-and-install', () =>
  {
    log.info( 'QUIT AND INSTALL' );

    autoUpdater.quitAndInstall();
  } );
}

function createWindow()
{
  window = new BrowserWindow( {
    width: 1000,
    height: 800,
    minWidth: 600,
    minHeight: 750,
    show: false,
    backgroundColor: "#fff"
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

      if( process.env.NODE_ENV !== 'development' )
      {
        setTimeout( () => autoUpdater.checkForUpdates(), 2000 );
      }
    }
  } );
}

app.on( 'ready', () =>
{
  createWindow();

  setupAutoUpdater();
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
