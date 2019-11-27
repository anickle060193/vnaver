import React from 'react';
import { connect } from 'react-redux';
import { Snackbar, IconButton, makeStyles, createStyles, Button, Box } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { assertNever } from 'utils/utils';
import { UpdaterState, ProgressInfo } from 'utils/updater';
import { quitAndInstall } from 'utils/auto_updater';

const BYTE_TO_MB = 1 / 1024 / 1024;

const useStyles = makeStyles( ( theme ) => createStyles( {
  closeButton: {
    padding: theme.spacing( 0.5 ),
  },
} ) );

interface PropsFromState
{
  updaterState: UpdaterState;
  downloadProgress: ProgressInfo | null;
  error: Error | null;
}

type Props = PropsFromState;

const UpdateNotification: React.SFC<Props> = ( { updaterState, downloadProgress, error } ) =>
{
  const classes = useStyles();

  const [ hide, setHide ] = React.useState( false );

  React.useEffect( () =>
  {
    setHide( false );
  }, [ updaterState ] );

  function onCloseClick()
  {
    setHide( true );
  }

  function onUpdateClick()
  {
    quitAndInstall();
  }

  let notification: React.ReactNode = null;
  let show: boolean;
  let action: React.ReactNode;

  if( updaterState === UpdaterState.None )
  {
    show = false;
  }
  else if( updaterState === UpdaterState.CheckingForUpdate )
  {
    show = true;
    notification = 'Checking for update...';
  }
  else if( updaterState === UpdaterState.UpdateAvailable )
  {
    show = true;
    notification = 'Update available';

    if( downloadProgress )
    {
      let { transferred, total, bytesPerSecond } = downloadProgress;
      let remainingTime = ( total - transferred ) / bytesPerSecond;
      let remainingTimeStr = remainingTime < 60
        ? `${( remainingTime ).toFixed()} secs`
        : `${( remainingTime / 60 ).toFixed()} mins`;
      notification = (
        <Box display="flex" flexDirection="column">
          <span>Downloading update...</span>
          <Box mt={1}>
            {( transferred * BYTE_TO_MB ).toFixed( 1 )}/{( total * BYTE_TO_MB ).toFixed( 1 )} MB - {remainingTimeStr} left
          </Box>
        </Box>
      );
    }
  }
  else if( updaterState === UpdaterState.UpdateNotAvailable )
  {
    show = false;
    notification = 'No updates available';
  }
  else if( updaterState === UpdaterState.UpdateDownloaded )
  {
    show = true;
    notification = 'Update downloaded';
    action = (
      <Button
        key="undo"
        color="secondary"
        size="small"
        onClick={onUpdateClick}
      >
        Restart?
      </Button>
    );
  }
  else if( updaterState === UpdaterState.Error )
  {
    show = false;
  }
  else
  {
    throw assertNever( updaterState );
  }

  if( hide )
  {
    show = false;
  }

  return (
    <Snackbar
      open={show}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom',
      }}
      message={notification}
      action={[
        action,
        (
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            className={classes.closeButton}
            onClick={onCloseClick}
          >
            <CloseIcon />
          </IconButton>
        )
      ]}
    />
  );
};

export default connect<PropsFromState, {}, {}, RootState>(
  ( state ) => ( {
    updaterState: state.updater.state,
    downloadProgress: state.updater.downloadProgress,
    error: state.updater.error
  } ),
  {
  }
)( UpdateNotification );
