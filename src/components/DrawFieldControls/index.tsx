import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from '@material-ui/core';

import { resetScaleLevel, resetOrigin, incrementScaleLevel, decrementScaleLevel } from 'store/reducers/editor';
import { showSettings, setGridOn } from 'store/reducers/settings';
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
  showSettings: typeof showSettings;
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
              <span className="material-icons">
                remove
              </span>
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
              <span className="material-icons">
                add
              </span>
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
            <span className="material-icons">
              {centered ? 'gps_fixed' : 'gps_not_fixed'}
            </span>
          </div>
        </Tooltip>

        <Tooltip placement="bottom" title={this.props.gridOn ? 'Hide Grid' : 'Display Grid'}>
          <div
            className="drawing-grid"
            onClick={this.onToggleGridOn}
          >
            <span className="material-icons">
              {!this.props.gridOn ? 'grid_off' : 'grid_on'}
            </span>
          </div>
        </Tooltip>

        <Tooltip placement="bottom" title="Settings">
          <div
            className="drawing-settings"
            onClick={this.onSettingsClick}
          >
            <span className="material-icons">settings</span>
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

  private onSettingsClick = () =>
  {
    this.props.showSettings();
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
    showSettings
  }
)( DrawFieldControls );
