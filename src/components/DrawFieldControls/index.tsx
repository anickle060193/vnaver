import * as React from 'react';
import { connect } from 'react-redux';

import Tooltip from 'components/Tooltip';
import { resetScaleLevel, resetOrigin, incrementScaleLevel, decrementScaleLevel } from 'store/reducers/editor';
import { showSettings, setGridOn } from 'store/reducers/settings';
import { loadDrawings } from 'store/reducers/drawings';
import { getScale, DrawingMap } from 'utils/draw';
import { exportImage, saveDiagram, openDiagram } from 'utils/electron';

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
  loadDrawings: typeof loadDrawings;
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
          <span className="material-icons">
            {centered ? 'gps_fixed' : 'gps_not_fixed'}
          </span>
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
          className="drawing-open-diagram"
          onClick={this.onOpenDiagram}
        >
          <Tooltip align="bottom" title="Open Diagram" />
          <span className="material-icons">folder_open</span>
        </div>

        <div
          className="drawing-save-diagram"
          onClick={this.onSaveDiagram}
        >
          <Tooltip align="bottom" title="Save Diagram" />
          <span className="material-icons">save</span>
        </div>

        <div
          className="drawing-export-image"
          onClick={this.onExportImage}
        >
          <Tooltip align="bottom" title="Export Image" />
          <span className="material-icons">photo</span>
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

  private onExportImage = () =>
  {
    let canvas = document.querySelector( 'canvas' ) as HTMLCanvasElement;
    if( canvas )
    {
      exportImage( canvas );
    }
  }

  private onSettingsClick = () =>
  {
    this.props.showSettings();
  }

  private onSaveDiagram = () =>
  {
    saveDiagram( this.props.drawings );
  }

  private onOpenDiagram = async () =>
  {
    let result = await openDiagram();
    if( result )
    {
      this.props.loadDrawings( result );
    }
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    originX: state.editor.originX,
    originY: state.editor.originY,
    scale: getScale( state.editor.scaleLevel ),
    gridOn: state.settings.gridOn,
    drawings: state.drawings.present.drawings
  } ),
  {
    incrementScaleLevel,
    decrementScaleLevel,
    resetScaleLevel,
    resetOrigin,
    setGridOn,
    showSettings,
    loadDrawings
  }
)( DrawFieldControls );
