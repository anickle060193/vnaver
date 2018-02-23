import { reducerWithInitialState } from 'typescript-fsa-reducers';
import actionCreatorFactory from 'typescript-fsa';
import { UpdateInfo } from 'electron-updater';

import { UpdaterState, ProgressInfo } from 'utils/updater';

export interface State
{
  state: UpdaterState;
  updateInfo: UpdateInfo | null;
  downloadProgress: ProgressInfo | null;
  error: Error | null;
}

const initialState: State = {
  state: UpdaterState.None,
  updateInfo: null,
  downloadProgress: null,
  error: null
};

const actionCreator = actionCreatorFactory();

export const checkingForUpdate = actionCreator( 'CHECKING_FOR_UPDATE' );
export const updateAvailable = actionCreator<UpdateInfo>( 'UPDATE_AVAILABLE' );
export const updateNotAvailable = actionCreator<UpdateInfo>( 'UPDATE_NOT_AVAILABLE' );
export const setDownloadProgress = actionCreator<ProgressInfo>( 'SET_DOWNLOAD_PROGRESS' );
export const updateDownloaded = actionCreator<UpdateInfo>( 'UPDATE_DOWNLOADED' );
export const updateError = actionCreator<Error>( 'UPDATE_ERROR' );

export const reducer = reducerWithInitialState( initialState )
  .case( checkingForUpdate, ( state ) =>
    ( {
      ...state,
      state: UpdaterState.CheckingForUpdate
    } ) )
  .case( updateAvailable, ( state, updateInfo ) =>
    ( {
      ...state,
      state: UpdaterState.UpdateAvailable,
      updateInfo
    } ) )
  .case( updateNotAvailable, ( state, updateInfo ) =>
    ( {
      ...state,
      state: UpdaterState.UpdateNotAvailable,
      updateInfo
    } ) )
  .case( setDownloadProgress, ( state, downloadProgress ) =>
    ( {
      ...state,
      downloadProgress
    } ) )
  .case( updateDownloaded, ( state, updateInfo ) =>
    ( {
      ...state,
      state: UpdaterState.UpdateDownloaded,
      updateInfo
    } ) )
  .case( updateError, ( state, error ) =>
    ( {
      ...state,
      error
    } ) );
