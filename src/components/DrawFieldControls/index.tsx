import * as React from 'react';
import { connect } from 'react-redux';

import Tooltip from 'components/Tooltip';
import { resetScaleLevel, resetOrigin, incrementScaleLevel, decrementScaleLevel } from 'store/reducers/drawing';
import { showSettings, setGridOn } from 'store/reducers/settings';

import './styles.css';
import { getScale } from 'utils/draw';

const CENTERED_POSITION_PATH = `M50 34C41.16 34 34 41.16 34 50S41.16 66 50 66 66 58.84 66 50 58.84 34 50
                                34ZM85.76 46C83.92 29.32 70.68 16.08 54 14.24V6H46V14.24C29.32 16.08 16.08 29.32 14.24
                                46H6V54H14.24C16.08 70.68 29.32 83.92 46 85.76V94H54V85.76C70.68 83.92 83.92 70.68 85.76
                                54H94V46H85.76ZM50 78C34.52 78 22 65.48 22 50S34.52 22 50 22 78 34.52 78 50 65.48 78 50 78Z`;

const UNCENTERED_POSITION_PATH = `M85.76 46C83.92 29.32 70.68 16.08 54 14.24L54 6 46 6 46 14.24C29.32 16.08 16.08 29.32
                                  14.24 46L6 46 6 54 14.24 54C16.08 70.68 29.32 83.92 46 85.76L46 94 54 94 54 85.76C70.68
                                  83.92 83.92 70.68 85.76 54L94 54 94 46 85.76 46ZM50 78C34.52 78 22 65.48 22
                                  50S34.52 22 50 22 78 34.52 78 50 65.48 78 50 78Z`;

interface PropsFromState
{
  originX: number;
  originY: number;
  scale: number;
  gridOn: boolean;
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
  render()
  {
    let centered = ( this.props.originX === 0 && this.props.originY === 0 );

    return (
      <div className="draw-controls">
        <div
          className="drawing-scale"
        >
          <div onClick={this.onZoomOutClick}>
            <Tooltip align="bottom" title="Zoom Out" />
            <span className="material-icons">
              remove
            </span>
          </div>

          <div onClick={this.onResetScale}>
            <Tooltip align="bottom" title="Reset Zoom" />
            <span className="drawing-scale-percentage">
              {( this.props.scale * 100 ).toFixed( 0 )}%
            </span>
          </div>

          <div onClick={this.onZoomInClick}>
            <Tooltip align="bottom" title="Zoom In" />
            <span className="material-icons">
              add
            </span>
          </div>
        </div>

        <div
          className={[
            'drawing-position',
            centered ? 'drawing-position-centered' : ''
          ].join( ' ' )}
          onClick={this.onResetOrigin}
        >
          <Tooltip align="bottom" title="Re-center" />
          <svg viewBox="0 0 100 100">
            <path d={centered ? CENTERED_POSITION_PATH : UNCENTERED_POSITION_PATH} />
          </svg>
        </div>

        <div
          className="drawing-grid"
          onClick={this.onToggleGridOn}
        >
          <Tooltip align="bottom" title={this.props.gridOn ? 'Hide Grid' : 'Display Grid'} />
          <span className="material-icons">
            {!this.props.gridOn ? 'grid_off' : 'grid_on'}
          </span>
        </div>

        <div
          className="drawing-settings"
          onClick={this.onSettingsClick}
        >
          <Tooltip align="bottom" title="Settings" />
          <span className="material-icons">settings</span>
        </div>
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
    originX: state.drawing.originX,
    originY: state.drawing.originY,
    scale: getScale( state.drawing.scaleLevel ),
    gridOn: state.settings.gridOn
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
