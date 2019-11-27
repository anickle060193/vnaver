import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { assertNever } from 'utils/utils';
import { UpdaterState, ProgressInfo } from 'utils/updater';
import { quitAndInstall } from 'utils/auto_updater';

import './styles.css';

const BYTE_TO_MB = 1 / 1024 / 1024;

interface PropsFromState
{
  updaterState: UpdaterState;
  downloadProgress: ProgressInfo | null;
  error: Error | null;
}

type Props = PropsFromState;

interface State
{
  hide: boolean;
}

class UpdateNotification extends React.Component<Props, State>
{
  constructor( props: Props )
  {
    super( props );

    this.state = {
      hide: false
    };
  }

  componentWillReceiveProps( newProps: Props )
  {
    if( this.props.updaterState !== newProps.updaterState )
    {
      this.setState( { hide: false } );
    }
  }

  render()
  {
    let notification: React.ReactNode = null;
    let show: boolean;

    if( this.props.updaterState === UpdaterState.None )
    {
      show = false;
    }
    else if( this.props.updaterState === UpdaterState.CheckingForUpdate )
    {
      show = true;
      notification = (
        'Checking for update...'
      );
    }
    else if( this.props.updaterState === UpdaterState.UpdateAvailable )
    {
      show = true;
      notification = (
        'Update available'
      );

      if( this.props.downloadProgress )
      {
        let { transferred, total, bytesPerSecond } = this.props.downloadProgress;
        let remainingTime = ( total - transferred ) / bytesPerSecond;
        let remainingTimeStr: string;
        if( remainingTime < 60 )
        {
          remainingTimeStr = `${( remainingTime ).toFixed()} secs`;
        }
        else
        {
          remainingTimeStr = `${( remainingTime / 60 ).toFixed()} mins`;
        }
        notification = (
          <div className="d-flex flex-column">
            Downloading update...
            <small className="mt-1">
              {( transferred * BYTE_TO_MB ).toFixed( 1 )}/{( total * BYTE_TO_MB ).toFixed( 1 )} MB {remainingTimeStr} left
            </small>
          </div>
        );
      }
    }
    else if( this.props.updaterState === UpdaterState.UpdateNotAvailable )
    {
      show = false;
      notification = (
        'No updates available'
      );
    }
    else if( this.props.updaterState === UpdaterState.UpdateDownloaded )
    {
      show = true;
      notification = (
        <>
          <span>Update downloaded</span>
          <button className="restart-button" onClick={this.onUpdateClick}>
            Restart?
          </button>
        </>
      );
    }
    else if( this.props.updaterState === UpdaterState.Error )
    {
      show = false;
    }
    else
    {
      show = false;
      throw assertNever( this.props.updaterState );
    }

    if( this.state.hide )
    {
      show = false;
    }

    return ReactDOM.createPortal(
      (
        <div
          className={[
            'update-notification',
            show ? 'update-notification-show' : ''
          ].join( ' ' )}
        >
          <div className="update-notification-content">
            {notification}
          </div>
          {this.props.updaterState !== UpdaterState.UpdateDownloaded && (
            <button
              className="update-notification-close"
              onClick={this.onCloseClick}
            >
              <span className="material-icons">close</span>
            </button>
          )}
        </div>
      ),
      document.body
    );
  }

  private onCloseClick = () =>
  {
    this.setState( { hide: true } );
  }

  private onUpdateClick = () =>
  {
    quitAndInstall();
  }
}

export default connect<PropsFromState, {}, {}, RootState>(
  ( state ) => ( {
    updaterState: state.updater.state,
    downloadProgress: state.updater.downloadProgress,
    error: state.updater.error
  } ),
  {
  }
)( UpdateNotification );
