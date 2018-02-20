import * as React from 'react';
import { connect } from 'react-redux';

import ToolbarItem from 'components/Toolbar/ToolbarItem';
import { setTool } from 'store/reducers/drawing';
import { DrawingType, Tool, DrawingTool, UP_ARROW_PATH, DOWN_ARROW_PATH, drawingTypeColors } from 'utils/draw';
import { shortcuts } from 'utils/settings';

import './styles.css';

const CURSOR_PATH = 'M18 2l64 49.116-27.804 4.68 17.3 35.268-14.384 6.936-17.4-35.516-21.712 18.808z';
const MOVE_PATH = `M21.915 71.415.5 49.999l21.414-21.415.001 16.49h23.16V21.915l-16.49
                          0L50.001.5l21.414 21.415-16.49 0v23.16h23.16l-.001-16.49L99.5
                          50.001l-21.415 21.414-.001-16.49h-23.16v23.16l16.49 0L49.999
                          99.5l-21.415-21.415 16.49 0V54.925H21.915L21.915 71.415z`;

interface PropsFromState
{
  tool: DrawingTool | null;
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
            shortcut={shortcuts[ Tool.Cursor ]}
            active={this.props.tool === Tool.Cursor}
            onClick={() => this.onToolClick( Tool.Cursor )}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2.5rem', height: '2.5rem' }}>
              <path d={CURSOR_PATH} />
            </svg>
          </ToolbarItem>

          <ToolbarItem
            title="Move"
            shortcut={shortcuts[ Tool.Move ]}
            active={this.props.tool === Tool.Move}
            onClick={() => this.onToolClick( Tool.Move )}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2.5rem', height: '2.5rem' }}>
              <path d={MOVE_PATH} />
            </svg>
          </ToolbarItem>

        </div>

        <div className="toolbar">

          <ToolbarItem
            title="Above Constraint"
            shortcut={shortcuts[ DrawingType.Above ]}
            active={this.props.tool === DrawingType.Above}
            onClick={() => this.onToolClick( DrawingType.Above )}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
              <path d={UP_ARROW_PATH} fill={drawingTypeColors[ DrawingType.Above ]} />
            </svg>
          </ToolbarItem>

          <ToolbarItem
            title="At Constraint"
            shortcut={shortcuts[ DrawingType.At ]}
            active={this.props.tool === DrawingType.At}
            onClick={() => this.onToolClick( DrawingType.At )}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem', marginBottom: '-20px' }}>
                <path d={DOWN_ARROW_PATH} fill={drawingTypeColors[ DrawingType.At ]} />
              </svg>
              <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
                <path d={UP_ARROW_PATH} fill={drawingTypeColors[ DrawingType.At ]} />
              </svg>
            </div>
          </ToolbarItem>

          <ToolbarItem
            title="Below Constraint"
            shortcut={shortcuts[ DrawingType.Below ]}
            active={this.props.tool === DrawingType.Below}
            onClick={() => this.onToolClick( DrawingType.Below )}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
              <path d={DOWN_ARROW_PATH} fill={drawingTypeColors[ DrawingType.Below ]} />
            </svg>
          </ToolbarItem>

          <ToolbarItem
            title="Between Constraint"
            shortcut={shortcuts[ DrawingType.Between ]}
            active={this.props.tool === DrawingType.Between}
            onClick={() => this.onToolClick( DrawingType.Between )}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem', marginBottom: '-8px' }}>
                <path d={DOWN_ARROW_PATH} fill={drawingTypeColors[ DrawingType.Between ]} />
              </svg>
              <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
                <path d={UP_ARROW_PATH} fill={drawingTypeColors[ DrawingType.Between ]} />
              </svg>
            </div>
          </ToolbarItem>

          <ToolbarItem
            title="Vertical Grid Line"
            shortcut={shortcuts[ DrawingType.VerticalGridLine ]}
            active={this.props.tool === DrawingType.VerticalGridLine}
            onClick={() => this.onToolClick( DrawingType.VerticalGridLine )}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
              <path d="M20 5 L20 95 M50 5 L50 95 M80 5 L80 95" stroke={drawingTypeColors[ DrawingType.VerticalGridLine ]} strokeWidth={6} />
            </svg>
          </ToolbarItem>

          <ToolbarItem
            title="Horizontal Grid Line"
            shortcut={shortcuts[ DrawingType.HorizontalGridLine ]}
            active={this.props.tool === DrawingType.HorizontalGridLine}
            onClick={() => this.onToolClick( DrawingType.HorizontalGridLine )}
          >
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
              <path d="M5 20 L95 20 M5 50 L95 50 M5 80 L95 80" stroke={drawingTypeColors[ DrawingType.HorizontalGridLine ]} strokeWidth={6} />
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
    tool: state.drawing.tool
  } ),
  {
    setTool
  }
)( Toolbar );
