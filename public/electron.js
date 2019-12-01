// @ts-check

const { app, BrowserWindow, ipcMain } = require( 'electron' );
const log = require( 'electron-log' );
const { autoUpdater } = require( 'electron-updater' );
const path = require( 'path' );
const url = require( 'url' );

/** @type {?BrowserWindow} */
let win = null;

log.transports.file.level = 'info';

log.info( 'App starting...' );

function setupAutoUpdater()
{
  autoUpdater.logger = log;

  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on( 'checking-for-update', () =>
  {
    if( win )
    {
      win.webContents.send( 'checking-for-update' );
    }
  } );

  autoUpdater.on( 'update-available', ( updateInfo ) =>
  {
    if( win )
    {
      win.webContents.send( 'update-available', updateInfo );
    }
  } );

  autoUpdater.on( 'update-not-available', ( updateInfo ) =>
  {
    if( win )
    {
      win.webContents.send( 'update-not-available', updateInfo );
    }
  } );

  autoUpdater.on( 'error', ( error ) =>
  {
    if( win )
    {
      win.webContents.send( 'error', error );
    }
  } );

  autoUpdater.on( 'download-progress', ( progress ) =>
  {
    if( win )
    {
      win.webContents.send( 'download-progress', progress );
    }
  } );

  autoUpdater.on( 'update-downloaded', ( updateInfo ) =>
  {
    if( win )
    {
      win.webContents.send( 'update-downloaded', updateInfo );
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
  win = new BrowserWindow( {
    width: 1000,
    height: 800,
    minWidth: 600,
    minHeight: 600,
    show: false,
    backgroundColor: "#fff",
    icon: path.join( __dirname, 'icon.ico' ),
    webPreferences: {
      nodeIntegration: true,
    },
  } );

  win.loadURL(
    process.env.NODE_ENV === 'development' ?
      'http://localhost:3000'
      :
      url.format( {
        pathname: path.join( __dirname, '/../build/index.html' ),
        protocol: 'file',
        slashes: true
      } )
  );

  win.on( 'closed', () =>
  {
    win = null;
  } );

  win.once( 'ready-to-show', () =>
  {
    if( win )
    {
      win.show();

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
  if( win === null )
  {
    createWindow();
  }
} );
