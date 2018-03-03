import * as React from 'react';
import { connect } from 'react-redux';

import Dialog from 'components/Dialog';
import ShortcutInput from 'components/SettingsDialog/ShortcutInput';
import NumberInput from 'components/NumberInput';
import { hideSettings, setShortcut, setDefaultDrawingColor, setSnapToGrid, setGridIntervalX, setGridIntervalY, setDeselectToolAfterAdd } from 'store/reducers/settings';
import { drawingToolDisplayNames, DrawingTool, DrawingTypeMap, DrawingType, Tool } from 'utils/draw';
import { ShortcutMap } from 'utils/shortcut';

import './styles.css';

interface PropsFromState
{
  show: boolean;
  shortcuts: ShortcutMap;
  defaultDrawingColors: DrawingTypeMap<string>;
  deselectToolAfterAdd: DrawingTypeMap<boolean>;
  gridIntervalX: number;
  gridIntervalY: number;
  snapToGrid: boolean;
}

interface PropsFromDispatch
{
  hideSettings: typeof hideSettings;
  setShortcut: typeof setShortcut;
  setDefaultDrawingColor: typeof setDefaultDrawingColor;
  setDeselectToolAfterAdd: typeof setDeselectToolAfterAdd;
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
        closeOnShadeClick={true}
      >
        <div className="settings">
          <div className="container-fluid">

            <div className="row">
              <h5>Grid Settings:</h5>
            </div>

            <div className="form-row">
              <div className="col-auto">
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
              </div>
            </div>

            <div className="form-row">
              <div className="col-1">
                <label className="col-form-label">Interval X:</label>
              </div>
              <div className="col-3">
                <NumberInput
                  className="form-control"
                  placeholder="x"
                  min={1}
                  value={this.props.gridIntervalX}
                  onChange={this.onGridIntervalXChange}
                />
              </div>
              <div className="col-1">
                <label className="col-form-label">Interval Y:</label>
              </div>
              <div className="col-3">
                <NumberInput
                  className="form-control"
                  placeholder="y"
                  min={1}
                  value={this.props.gridIntervalY}
                  onChange={this.onGridIntervalYChange}
                />
              </div>
            </div>

            <div className="row mt-2">
              <h5>Tools Settings:</h5>
            </div>

            <div className="form-row">
              <div className="col-4 d-flex align-items-end">
                <b>Tool</b>
              </div>
              <div className="col-3 d-flex align-items-end justify-content-center text-center">
                <b>Shortcut</b>
              </div>
              <div className="col-3 d-flex align-items-end justify-content-center text-center">
                <b>Default Color</b>
              </div>
              <div className="col-2 d-flex align-items-end justify-content-center text-center">
                <b>Deselect Tool After Add</b>
              </div>
            </div>
            {Object.entries( drawingToolDisplayNames ).map( ( [ tool, name ]: [ DrawingTool, string ] ) => (
              <div key={tool} className="form-group form-row">
                <label className="col-4 col-form-label">{name}:</label>
                <div className="col-3">
                  <ShortcutInput
                    className="form-control"
                    shortcut={this.props.shortcuts[ tool ]}
                    onChange={( shortcut ) => this.onShortcutChange( tool, shortcut )}
                  />
                </div>
                {( tool !== Tool.Cursor ) && (
                  <>
                    <div className="col-3">
                      <input
                        type="color"
                        className="form-control"
                        value={this.props.defaultDrawingColors[ tool ]}
                        onChange={( e ) => this.onDefaultDrawingColorChange( tool, e.target.value )}
                      />
                    </div>
                    <div className="col-2 d-flex justify-content-center">
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={this.props.deselectToolAfterAdd[ tool ]}
                          onChange={( e ) => this.onDeselectToolAfterAddChange( tool, e.target.checked )}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) )}

            <div className="row mt-4">
              <button className="btn btn-primary ml-auto" onClick={this.onClose}>Close</button>
            </div>

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

  private onGridIntervalXChange = ( gridIntervalX: number ) =>
  {
    this.props.setGridIntervalX( gridIntervalX );
  }

  private onGridIntervalYChange = ( gridIntervalY: number ) =>
  {
    this.props.setGridIntervalY( gridIntervalY );
  }

  private onDeselectToolAfterAddChange = ( drawingType: DrawingType, deselectToolAfterAdd: boolean ) =>
  {
    this.props.setDeselectToolAfterAdd( { drawingType, deselectToolAfterAdd } );
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    show: state.settings.show,
    shortcuts: state.settings.shortcuts,
    defaultDrawingColors: state.settings.defaultDrawingColors,
    deselectToolAfterAdd: state.settings.deselectToolAfterAdd,
    gridIntervalX: state.settings.gridIntervalX,
    gridIntervalY: state.settings.gridIntervalY,
    snapToGrid: state.settings.snapToGrid
  } ),
  {
    hideSettings,
    setShortcut,
    setDefaultDrawingColor,
    setDeselectToolAfterAdd,
    setGridIntervalX,
    setGridIntervalY,
    setSnapToGrid
  }
)( SettingsDialog );
