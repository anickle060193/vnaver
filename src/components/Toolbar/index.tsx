import * as React from 'react';
import { connect } from 'react-redux';

import ToolbarItem from 'components/Toolbar/ToolbarItem';
import { setTool } from 'store/reducers/editor';
import { DrawingType, Tool, DrawingTool, UP_ARROW_PATH, DOWN_ARROW_PATH, PLANE_PATH, DrawingTypeMap } from 'utils/draw';
import { ShortcutMap } from 'utils/shortcut';

import './styles.css';

const CURSOR_PATH = 'M18 2l64 49.116-27.804 4.68 17.3 35.268-14.384 6.936-17.4-35.516-21.712 18.808z';

interface PropsFromState
{
  tool: DrawingTool | null;
  shortcuts: ShortcutMap;
  defaultDrawingColors: DrawingTypeMap<string>;
}

interface PropsFromDispatch
{
  setTool: typeof setTool;
}

type Props = ( PropsFromState & PropsFromDispatch );

class Toolbar extends React.Component<Props>
{
  render()
  {
    return (
      <div className="toolbars">

        <div className="toolbar">

          <ToolbarItem
            title="Cursor"
            shortcut={this.props.shortcuts[ Tool.Cursor ]}
            active={this.props.tool === Tool.Cursor}
            onClick={() => this.onToolClick( Tool.Cursor )}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2.5rem', height: '2.5rem' }}>
              <path d={CURSOR_PATH} />
            </svg>
          </ToolbarItem>

        </div>

        <div className="toolbar">

          <ToolbarItem
            title="Plane"
            shortcut={this.props.shortcuts[ DrawingType.Plane ]}
            active={this.props.tool === DrawingType.Plane}
            onClick={() => this.onToolClick( DrawingType.Plane )}
          >
            <svg viewBox="-50 -50 100 100" style={{ width: '2rem', height: '2rem' }}>
              <path d={PLANE_PATH} fill={this.props.defaultDrawingColors[ DrawingType.Plane ]} />
            </svg>
          </ToolbarItem>

          <ToolbarItem
            title="Above Constraint"
            shortcut={this.props.shortcuts[ DrawingType.Above ]}
            active={this.props.tool === DrawingType.Above}
            onClick={() => this.onToolClick( DrawingType.Above )}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
              <path d={UP_ARROW_PATH} fill={this.props.defaultDrawingColors[ DrawingType.Above ]} />
            </svg>
          </ToolbarItem>

          <ToolbarItem
            title="At Constraint"
            shortcut={this.props.shortcuts[ DrawingType.At ]}
            active={this.props.tool === DrawingType.At}
            onClick={() => this.onToolClick( DrawingType.At )}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem', marginBottom: '-20px' }}>
                <path d={DOWN_ARROW_PATH} fill={this.props.defaultDrawingColors[ DrawingType.At ]} />
              </svg>
              <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
                <path d={UP_ARROW_PATH} fill={this.props.defaultDrawingColors[ DrawingType.At ]} />
              </svg>
            </div>
          </ToolbarItem>

          <ToolbarItem
            title="Below Constraint"
            shortcut={this.props.shortcuts[ DrawingType.Below ]}
            active={this.props.tool === DrawingType.Below}
            onClick={() => this.onToolClick( DrawingType.Below )}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
              <path d={DOWN_ARROW_PATH} fill={this.props.defaultDrawingColors[ DrawingType.Below ]} />
            </svg>
          </ToolbarItem>

          <ToolbarItem
            title="Between Constraint"
            shortcut={this.props.shortcuts[ DrawingType.Between ]}
            active={this.props.tool === DrawingType.Between}
            onClick={() => this.onToolClick( DrawingType.Between )}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem', marginBottom: '-8px' }}>
                <path d={DOWN_ARROW_PATH} fill={this.props.defaultDrawingColors[ DrawingType.Between ]} />
              </svg>
              <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
                <path d={UP_ARROW_PATH} fill={this.props.defaultDrawingColors[ DrawingType.Between ]} />
              </svg>
            </div>
          </ToolbarItem>

          <ToolbarItem
            title="Path Line"
            shortcut={this.props.shortcuts[ DrawingType.PathLine ]}
            active={this.props.tool === DrawingType.PathLine}
            onClick={() => this.onToolClick( DrawingType.PathLine )}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
              <line x1={10} y1={10} x2={80} y2={80} stroke={this.props.defaultDrawingColors[ DrawingType.PathLine ]} strokeWidth={6} />
              <circle cx={10} cy={10} r={10} fill={this.props.defaultDrawingColors[ DrawingType.PathLine ]} />
              <circle cx={10} cy={10} r={6} fill="white" />
              <circle cx={80} cy={80} r={10} fill={this.props.defaultDrawingColors[ DrawingType.PathLine ]} />
              <circle cx={80} cy={80} r={6} fill="white" />
            </svg>
          </ToolbarItem>

          <ToolbarItem
            title="Vertical Grid Line"
            shortcut={this.props.shortcuts[ DrawingType.VerticalGridLine ]}
            active={this.props.tool === DrawingType.VerticalGridLine}
            onClick={() => this.onToolClick( DrawingType.VerticalGridLine )}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
              <path d="M20 5 L20 95 M50 5 L50 95 M80 5 L80 95" stroke={this.props.defaultDrawingColors[ DrawingType.VerticalGridLine ]} strokeWidth={6} />
            </svg>
          </ToolbarItem>

          <ToolbarItem
            title="Horizontal Grid Line"
            shortcut={this.props.shortcuts[ DrawingType.HorizontalGridLine ]}
            active={this.props.tool === DrawingType.HorizontalGridLine}
            onClick={() => this.onToolClick( DrawingType.HorizontalGridLine )}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
              <path d="M5 20 L95 20 M5 50 L95 50 M5 80 L95 80" stroke={this.props.defaultDrawingColors[ DrawingType.HorizontalGridLine ]} strokeWidth={6} />
            </svg>
          </ToolbarItem>

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
    tool: state.editor.tool,
    shortcuts: state.settings.shortcuts,
    defaultDrawingColors: state.settings.defaultDrawingColors
  } ),
  {
    setTool
  }
)( Toolbar );
