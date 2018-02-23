import { Store } from 'redux';
import { UpdateInfo } from 'electron-updater';

import
{
  checkingForUpdate,
  updateAvailable,
  updateNotAvailable,
  updateError,
  setDownloadProgress,
  updateDownloaded
} from 'store/reducers/updater';

import electron from 'utils/electron';
import { ProgressInfo } from 'utils/updater';

export function createAutoUpdater( store: Store<RootState> )
{
  electron.ipcRenderer.on( 'checking-for-update', ( event: Electron.Event ) =>
  {
    store.dispatch( checkingForUpdate() );
  } );

  electron.ipcRenderer.on( 'update-available', ( event: Electron.Event, updateInfo: UpdateInfo ) =>
  {
    store.dispatch( updateAvailable( updateInfo ) );
  } );

  electron.ipcRenderer.on( 'update-not-available', ( event: Electron.Event, updateInfo: UpdateInfo ) =>
  {
    store.dispatch( updateNotAvailable( updateInfo ) );
  } );

  electron.ipcRenderer.on( 'error', ( event: Electron.Event, error: Error ) =>
  {
    store.dispatch( updateError( error ) );
  } );

  electron.ipcRenderer.on( 'download-progress', ( event: Electron.Event, progress: ProgressInfo ) =>
  {
    store.dispatch( setDownloadProgress( progress ) );
  } );

  electron.ipcRenderer.on( 'update-downloaded', ( event: Electron.Event, updateInfo: UpdateInfo ) =>
  {
    store.dispatch( updateDownloaded( updateInfo ) );
  } );
}

export function quitAndInstall()
{
  electron.ipcRenderer.send( 'quit-and-install' );
}
