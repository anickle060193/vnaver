import * as React from 'react';
import { connect } from 'react-redux';

import Dialog from 'components/Dialog';
import ShortcutInput from 'components/SettingsDialog/ShortcutInput';
import { hideSettings, setShortcut, setDefaultDrawingColor, setSnapToGrid, setGridIntervalX, setGridIntervalY } from 'store/reducers/settings';
import { drawingToolDisplayNames, DrawingTool, DrawingTypeMap, DrawingType, Tool } from 'utils/draw';
import { ShortcutMap } from 'utils/shortcut';

import './styles.css';

interface PropsFromState
{
  show: boolean;
  shortcuts: ShortcutMap;
  defaultDrawingColors: DrawingTypeMap<string>;
  gridIntervalX: number;
  gridIntervalY: number;
  snapToGrid: boolean;
}

interface PropsFromDispatch
{
  hideSettings: typeof hideSettings;
  setShortcut: typeof setShortcut;
  setDefaultDrawingColor: typeof setDefaultDrawingColor;
  setGridIntervalX: typeof setGridIntervalX;
  setGridIntervalY: typeof setGridIntervalY;
  setSnapToGrid: typeof setSnapToGrid;
}

type Props = PropsFromState & PropsFromDispatch;

interface State
{
  shortcut: string;
}

class SettingsDialog extends React.Component<Props, State>
{
  constructor( props: Props )
  {
    super( props );

    this.state = {
      shortcut: ''
    };
  }

  render()
  {
    return (
      <Dialog
        show={this.props.show}
        onClose={this.onClose}
      >
        <div className="settings">
          <div className="container-fluid d-flex flex-column">

            <div className="grid-settings">
              <b className="d-block">Grid Settings:</b>

              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={this.props.snapToGrid}
                    onChange={this.onSnapToGridChange}
                  />
                  Snap to Grid
                </label>
              </div>

              <div className="grid-intervals">
                <label>Interval X:</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="x"
                  value={this.props.gridIntervalX.toString()}
                  onChange={this.onGridIntervalXChange}
                />
                <label>Interval Y:</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="y"
                  value={this.props.gridIntervalY.toString()}
                  onChange={this.onGridIntervalYChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-4">
                <b>Tool</b>
              </div>
              <div className="col-sm-4 d-flex justify-content-center">
                <b>Shortcut</b>
              </div>
              <div className="col-sm-4 d-flex justify-content-center">
                <b>Default Color</b>
              </div>
            </div>
            {Object.entries( drawingToolDisplayNames ).map( ( [ tool, name ]: [ DrawingTool, string ] ) => (
              <div key={tool} className="form-group row">
                <label className="col-sm-4 col-form-label">{name}:</label>
                <div className="col-sm-4">
                  <ShortcutInput
                    className="form-control"
                    shortcut={this.props.shortcuts[ tool ]}
                    onChange={( shortcut ) => this.onShortcutChange( tool, shortcut )}
                  />
                </div>
                {( tool !== Tool.Cursor ) && (
                  <div className="col-sm-4">
                    <input
                      type="color"
                      className="form-control"
                      value={this.props.defaultDrawingColors[ tool ]}
                      onChange={( e ) => this.onDefaultDrawingColorChange( tool, e.target.value )}
                    />
                  </div>
                )}
              </div>
            ) )}

            <button
              className="btn btn-primary ml-auto"
              onClick={this.onClose}
            >
              Close
            </button>

          </div>
        </div>
      </Dialog>
    );
  }

  private onClose = () =>
  {
    this.props.hideSettings();
  }

  private onShortcutChange = ( tool: DrawingTool, shortcut: string ) =>
  {
    this.props.setShortcut( { tool, shortcut } );
  }

  private onDefaultDrawingColorChange = ( drawingType: DrawingType, color: string ) =>
  {
    this.props.setDefaultDrawingColor( { drawingType, color } );
  }

  private onSnapToGridChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.setSnapToGrid( e.target.checked );
  }

  private onGridIntervalXChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.setGridIntervalX( e.target.valueAsNumber || 0 );
  }

  private onGridIntervalYChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.setGridIntervalY( e.target.valueAsNumber || 0 );
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    show: state.settings.show,
    shortcuts: state.settings.shortcuts,
    defaultDrawingColors: state.settings.defaultDrawingColors,
    gridIntervalX: state.settings.gridIntervalX,
    gridIntervalY: state.settings.gridIntervalY,
    snapToGrid: state.settings.snapToGrid
  } ),
  {
    hideSettings,
    setShortcut,
    setDefaultDrawingColor,
    setGridIntervalX,
    setGridIntervalY,
    setSnapToGrid
  }
)( SettingsDialog );
