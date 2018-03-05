import * as React from 'react';
import { connect } from 'react-redux';

import ToolbarItem from 'components/Toolbar/ToolbarItem';
import { setTool } from 'store/reducers/editor';
import { currentEditorState } from 'store/selectors';
import { DrawingType, Tool, DrawingTool, UP_ARROW_PATH, DOWN_ARROW_PATH, PLANE_PATH, DrawingTypeMap, drawingToolDisplayNames } from 'utils/draw';
import { ShortcutMap } from 'utils/shortcut';

import './styles.css';

const CURSOR_PATH = 'M18 2l64 49.116-27.804 4.68 17.3 35.268-14.384 6.936-17.4-35.516-21.712 18.808z';

interface PropsFromState
{
  tool: DrawingTool;
  shortcuts: ShortcutMap;
  defaultDrawingColors: DrawingTypeMap<string>;
}

interface PropsFromDispatch
{
  setTool: typeof setTool;
}

type Props = ( PropsFromState & PropsFromDispatch );

const DrawingToolToolbarItem: React.SFC<{
  tool: DrawingTool;
  selectedTool: DrawingTool;
  onClick: ( tool: DrawingTool ) => void;
  shortcuts: ShortcutMap;
}> = ( { tool, selectedTool, onClick, children, shortcuts } ) => (
  <ToolbarItem
    title={drawingToolDisplayNames[ tool ]}
    shortcut={shortcuts[ tool ]}
    active={tool === selectedTool}
    onClick={() => onClick( tool )}
  >
    {children}
  </ToolbarItem>
);

class Toolbar extends React.Component<Props>
{
  render()
  {
    return (
      <div className="toolbars">

        <div className="toolbar">

          <DrawingToolToolbarItem
            tool={Tool.Cursor}
            selectedTool={this.props.tool}
            shortcuts={this.props.shortcuts}
            onClick={this.onToolClick}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2.5rem', height: '2.5rem' }}>
              <path d={CURSOR_PATH} />
            </svg>
          </DrawingToolToolbarItem>

        </div>

        <div className="toolbar">

          <DrawingToolToolbarItem
            tool={DrawingType.Plane}
            selectedTool={this.props.tool}
            shortcuts={this.props.shortcuts}
            onClick={this.onToolClick}
          >
            <svg viewBox="-50 -50 100 100" style={{ width: '2rem', height: '2rem' }}>
              <path d={PLANE_PATH} fill={this.props.defaultDrawingColors[ DrawingType.Plane ]} />
            </svg>
          </DrawingToolToolbarItem>

          <DrawingToolToolbarItem
            tool={DrawingType.Text}
            selectedTool={this.props.tool}
            shortcuts={this.props.shortcuts}
            onClick={this.onToolClick}
          >
            <span
              className="material-icons"
              style={{
                color: this.props.defaultDrawingColors[ DrawingType.Text ],
                fontSize: '26pt'
              }}
            >
              text_fields
            </span>
          </DrawingToolToolbarItem>

          <DrawingToolToolbarItem
            tool={DrawingType.Above}
            selectedTool={this.props.tool}
            shortcuts={this.props.shortcuts}
            onClick={this.onToolClick}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
              <path d={UP_ARROW_PATH} fill={this.props.defaultDrawingColors[ DrawingType.Above ]} />
            </svg>
          </DrawingToolToolbarItem>

          <DrawingToolToolbarItem
            tool={DrawingType.At}
            selectedTool={this.props.tool}
            shortcuts={this.props.shortcuts}
            onClick={this.onToolClick}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem', marginBottom: '-20px' }}>
                <path d={DOWN_ARROW_PATH} fill={this.props.defaultDrawingColors[ DrawingType.At ]} />
              </svg>
              <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
                <path d={UP_ARROW_PATH} fill={this.props.defaultDrawingColors[ DrawingType.At ]} />
              </svg>
            </div>
          </DrawingToolToolbarItem>

          <DrawingToolToolbarItem
            tool={DrawingType.Below}
            selectedTool={this.props.tool}
            shortcuts={this.props.shortcuts}
            onClick={this.onToolClick}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
              <path d={DOWN_ARROW_PATH} fill={this.props.defaultDrawingColors[ DrawingType.Below ]} />
            </svg>
          </DrawingToolToolbarItem>

          <DrawingToolToolbarItem
            tool={DrawingType.Between}
            selectedTool={this.props.tool}
            shortcuts={this.props.shortcuts}
            onClick={this.onToolClick}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem', marginBottom: '-8px' }}>
                <path d={DOWN_ARROW_PATH} fill={this.props.defaultDrawingColors[ DrawingType.Between ]} />
              </svg>
              <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
                <path d={UP_ARROW_PATH} fill={this.props.defaultDrawingColors[ DrawingType.Between ]} />
              </svg>
            </div>
          </DrawingToolToolbarItem>

          <DrawingToolToolbarItem
            tool={DrawingType.PathLine}
            selectedTool={this.props.tool}
            shortcuts={this.props.shortcuts}
            onClick={this.onToolClick}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
              <line x1={10} y1={10} x2={80} y2={80} stroke={this.props.defaultDrawingColors[ DrawingType.PathLine ]} strokeWidth={6} />
              <circle cx={10} cy={10} r={10} fill={this.props.defaultDrawingColors[ DrawingType.PathLine ]} />
              <circle cx={10} cy={10} r={6} fill="white" />
              <circle cx={80} cy={80} r={10} fill={this.props.defaultDrawingColors[ DrawingType.PathLine ]} />
              <circle cx={80} cy={80} r={6} fill="white" />
            </svg>
          </DrawingToolToolbarItem>

          <DrawingToolToolbarItem
            tool={DrawingType.VerticalGridLine}
            selectedTool={this.props.tool}
            shortcuts={this.props.shortcuts}
            onClick={this.onToolClick}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
              <path d="M20 5 L20 95 M50 5 L50 95 M80 5 L80 95" stroke={this.props.defaultDrawingColors[ DrawingType.VerticalGridLine ]} strokeWidth={6} />
            </svg>
          </DrawingToolToolbarItem>

          <DrawingToolToolbarItem
            tool={DrawingType.HorizontalGridLine}
            selectedTool={this.props.tool}
            shortcuts={this.props.shortcuts}
            onClick={this.onToolClick}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
              <path d="M5 20 L95 20 M5 50 L95 50 M5 80 L95 80" stroke={this.props.defaultDrawingColors[ DrawingType.HorizontalGridLine ]} strokeWidth={6} />
            </svg>
          </DrawingToolToolbarItem>

        </div>

      </div>
    );
  }

  private onToolClick = ( tool: DrawingTool ) =>
  {
    if( this.props.tool === tool
      && this.props.tool !== Tool.Cursor )
    {
      this.props.setTool( Tool.Cursor );
    }
    else
    {
      this.props.setTool( tool );
    }
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    tool: currentEditorState( state ).tool,
    shortcuts: state.settings.shortcuts,
    defaultDrawingColors: state.settings.defaultDrawingColors
  } ),
  {
    setTool
  }
)( Toolbar );
