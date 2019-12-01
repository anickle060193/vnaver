import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Tooltip, makeStyles, createStyles, Paper, IconButton, Typography, colors } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';
import GridOnIcon from '@material-ui/icons/GridOn';
import GridOffIcon from '@material-ui/icons/GridOff';

import { resetScaleLevel, resetOrigin, incrementScaleLevel, decrementScaleLevel } from 'store/reducers/editor';
import { setGridOn } from 'store/reducers/settings';
import { currentEditorState, currentDrawingsState } from 'store/selectors';

import { getScale, DrawingMap, MIN_SCALE_LEVEL, DEFAULT_SCALE_LEVEL, MAX_SCALE_LEVEL } from 'utils/draw';

const useStyles = makeStyles( ( theme ) => createStyles( {
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing( 1 ),
  },
  scaleText: {
    cursor: 'pointer',
    minWidth: '3em',
    textAlign: 'center',
  },
  resetScaleDisabled: {
    cursor: 'default',
  },
  recenterButtonCentered: {
    color: colors.lightBlue[ 800 ],
  },
  gridButton: {
    borderRadius: 6,
  },
} ) );

interface PropsFromState
{
  originX: number;
  originY: number;
  scaleLevel: number;
  gridOn: boolean;
  drawings: DrawingMap;
}

interface PropsFromDispatch
{
  incrementScaleLevel: typeof incrementScaleLevel;
  decrementScaleLevel: typeof decrementScaleLevel;
  resetScaleLevel: typeof resetScaleLevel;
  resetOrigin: typeof resetOrigin;
  setGridOn: typeof setGridOn;
}

type Props = PropsFromState & PropsFromDispatch;

const DrawFieldControls: React.SFC<Props> = ( {
  originX,
  originY,
  scaleLevel,
  gridOn,
  drawings,
  ...actions
} ) =>
{
  const styles = useStyles();

  const scale = getScale( scaleLevel );
  const centered = ( originX === 0 && originY === 0 );

  function onZoomOutClick( e: React.MouseEvent<{}> )
  {
    e.stopPropagation();

    actions.decrementScaleLevel();
  }

  function onZoomInClick( e: React.MouseEvent<{}> )
  {
    e.stopPropagation();

    actions.incrementScaleLevel();
  }

  function onResetScale()
  {
    actions.resetScaleLevel();
  }

  function onResetOrigin()
  {
    actions.resetOrigin();
  }

  function onToggleGridOn()
  {
    actions.setGridOn( !gridOn );
  }

  return (
    <Paper className={styles.root}>
      <Tooltip placement="bottom" title="Zoom Out">
        <div>
          <IconButton
            size="small"
            onClick={onZoomOutClick}
            disabled={scaleLevel === MIN_SCALE_LEVEL}
          >
            <RemoveIcon />
          </IconButton>
        </div>
      </Tooltip>

      <Tooltip placement="bottom" title="Reset Zoom">
        <span>
          <Typography
            className={classNames(
              styles.scaleText,
              ( scaleLevel === DEFAULT_SCALE_LEVEL ) && styles.resetScaleDisabled
            )}
            onClick={onResetScale}
          >
            {( scale * 100 ).toFixed( 0 )}%
          </Typography>
        </span>
      </Tooltip>

      <Tooltip placement="bottom" title="Zoom In">
        <div>
          <IconButton
            size="small"
            onClick={onZoomInClick}
            disabled={scaleLevel === MAX_SCALE_LEVEL}
          >
            <AddIcon />
          </IconButton>
        </div>
      </Tooltip>

      <Tooltip placement="bottom" title="Re-center">
        <IconButton
          className={classNames( centered && styles.recenterButtonCentered )}
          size="small"
          color="default"
          onClick={onResetOrigin}
        >
          {centered ? (
            <GpsFixedIcon />
          ) : (
              <GpsNotFixedIcon />
            )}
        </IconButton>
      </Tooltip>

      <Tooltip placement="bottom" title={gridOn ? 'Hide Grid' : 'Display Grid'}>
        <IconButton
          size="small"
          className={styles.gridButton}
          onClick={onToggleGridOn}
        >
          {!gridOn ? (
            <GridOffIcon />
          ) : (
              <GridOnIcon />
            )}
        </IconButton>
      </Tooltip>

    </Paper>
  );
};

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    originX: currentEditorState( state ).originX,
    originY: currentEditorState( state ).originY,
    scaleLevel: currentEditorState( state ).scaleLevel,
    gridOn: state.settings.gridOn,
    drawings: currentDrawingsState( state ).drawings
  } ),
  {
    incrementScaleLevel,
    decrementScaleLevel,
    resetScaleLevel,
    resetOrigin,
    setGridOn,
  }
)( DrawFieldControls );
