import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';
import GridOnIcon from '@material-ui/icons/GridOn';
import GridOffIcon from '@material-ui/icons/GridOff';

import { resetScaleLevel, resetOrigin, incrementScaleLevel, decrementScaleLevel } from 'store/reducers/editor';
import { setGridOn } from 'store/reducers/settings';
import { currentEditorState, currentDrawingsState } from 'store/selectors';
import { getScale, DrawingMap } from 'utils/draw';

import './styles.css';

interface PropsFromState
{
  originX: number;
  originY: number;
  scale: number;
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

class DrawFieldControls extends React.Component<Props>
{
  public render()
  {
    let centered = ( this.props.originX === 0 && this.props.originY === 0 );

    return (
      <div className="draw-controls">
        <div
          className="drawing-scale"
        >
          <Tooltip placement="bottom" title="Zoom Out">
            <div onClick={this.onZoomOutClick}>
              <RemoveIcon />
            </div>
          </Tooltip>

          <Tooltip placement="bottom" title="Reset Zoom">
            <div onClick={this.onResetScale}>
              <span className="drawing-scale-percentage">
                {( this.props.scale * 100 ).toFixed( 0 )}%
              </span>
            </div>
          </Tooltip>

          <Tooltip placement="bottom" title="Zoom In">
            <div onClick={this.onZoomInClick}>
              <AddIcon />
            </div>
          </Tooltip>

        </div>

        <Tooltip placement="bottom" title="Re-center">
          <div
            className={[
              'drawing-position',
              centered ? 'drawing-position-centered' : ''
            ].join( ' ' )}
            onClick={this.onResetOrigin}
          >
            {centered ? (
              <GpsFixedIcon />
            ) : (
                <GpsNotFixedIcon />
              )}
          </div>
        </Tooltip>

        <Tooltip placement="bottom" title={this.props.gridOn ? 'Hide Grid' : 'Display Grid'}>
          <div
            className="drawing-grid"
            onClick={this.onToggleGridOn}
          >
            {!this.props.gridOn ? (
              <GridOffIcon />
            ) : (
                <GridOnIcon />
              )}
          </div>
        </Tooltip>

      </div>
    );
  }

  private onZoomOutClick = ( e: React.MouseEvent<{}> ) =>
  {
    e.stopPropagation();

    this.props.decrementScaleLevel();
  }

  private onZoomInClick = ( e: React.MouseEvent<{}> ) =>
  {
    e.stopPropagation();

    this.props.incrementScaleLevel();
  }

  private onResetScale = () =>
  {
    this.props.resetScaleLevel();
  }

  private onResetOrigin = () =>
  {
    this.props.resetOrigin();
  }

  private onToggleGridOn = () =>
  {
    this.props.setGridOn( !this.props.gridOn );
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    originX: currentEditorState( state ).originX,
    originY: currentEditorState( state ).originY,
    scale: getScale( currentEditorState( state ).scaleLevel ),
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
