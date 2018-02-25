import * as React from 'react';
import { connect } from 'react-redux';

import Dialog from 'components/Dialog';
import ShortcutInput from 'components/SettingsDialog/ShortcutInput';
import { hideSettings, setShortcut, setDefaultDrawingColor } from 'store/reducers/settings';
import { drawingToolDisplayNames, DrawingTool, DrawingTypeMap, DrawingType, Tool } from 'utils/draw';
import { ShortcutMap } from 'utils/shortcut';

import './styles.css';

interface PropsFromState
{
  show: boolean;
  shortcuts: ShortcutMap;
  defaultDrawingColors: DrawingTypeMap<string>;
}

interface PropsFromDispatch
{
  hideSettings: typeof hideSettings;
  setShortcut: typeof setShortcut;
  setDefaultDrawingColor: typeof setDefaultDrawingColor;
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
            <form>
              <div className="row">
                <div className="col-sm-4">
                  <h4>Tool</h4>
                </div>
                <div className="col-sm-4 d-flex justify-content-center">
                  <h4>Shortcut</h4>
                </div>
                <div className="col-sm-4 d-flex justify-content-center">
                  <h4>Default Color</h4>
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
            </form>

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
    console.log( 'COLOR:', drawingType, color );
    this.props.setDefaultDrawingColor( { drawingType, color } );
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    show: state.settings.show,
    shortcuts: state.settings.shortcuts,
    defaultDrawingColors: state.settings.defaultDrawingColors
  } ),
  {
    hideSettings,
    setShortcut,
    setDefaultDrawingColor
  }
)( SettingsDialog );
