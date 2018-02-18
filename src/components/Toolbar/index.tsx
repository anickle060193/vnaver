import * as React from 'react';
import { connect } from 'react-redux';

import ToolbarItem from 'components/Toolbar/ToolbarItem';
import { setTool } from 'store/reducers/drawing';
import { DrawingType, Tool, DrawingTool, MOVE_PATH, UP_ARROW_PATH, DOWN_ARROW_PATH, drawingTypeColors } from 'utils/draw';

import './styles.css';

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
      <div className="toolbar">
        <ToolbarItem
          title="Move"
          active={this.props.tool === Tool.Move}
          onClick={() => this.onToolClick( Tool.Move )}
        >
          <svg viewBox="0 0 100 100" style={{ width: '2.5rem', height: '2.5rem' }}>
            <path d={MOVE_PATH} />
          </svg>
        </ToolbarItem>

        <ToolbarItem
          title="Above Constraint"
          active={this.props.tool === DrawingType.Above}
          onClick={() => this.onToolClick( DrawingType.Above )}
        >
          <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
            <path d={UP_ARROW_PATH} fill={drawingTypeColors[ DrawingType.Above ]} />
          </svg>
        </ToolbarItem>

        <ToolbarItem
          title="At Constraint"
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
          active={this.props.tool === DrawingType.Below}
          onClick={() => this.onToolClick( DrawingType.Below )}
        >
          <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
            <path d={DOWN_ARROW_PATH} fill={drawingTypeColors[ DrawingType.Below ]} />
          </svg>
        </ToolbarItem>

        <ToolbarItem
          title="Between Constraint"
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
          active={this.props.tool === DrawingType.VerticalGridLine}
          onClick={() => this.onToolClick( DrawingType.VerticalGridLine )}
        >
          <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
            <path d="M20 5 L20 95 M50 5 L50 95 M80 5 L80 95" stroke={drawingTypeColors[ DrawingType.VerticalGridLine ]} strokeWidth={6} />
          </svg>
        </ToolbarItem>

        <ToolbarItem
          title="Horizontal Grid Line"
          active={this.props.tool === DrawingType.HorizontalGridLine}
          onClick={() => this.onToolClick( DrawingType.HorizontalGridLine )}
        >
          <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem' }}>
            <path d="M5 20 L95 20 M5 50 L95 50 M5 80 L95 80" stroke={drawingTypeColors[ DrawingType.HorizontalGridLine ]} strokeWidth={6} />
          </svg>
        </ToolbarItem>
      </div>
    );
  }

  private onToolClick = ( tool: DrawingTool ) =>
  {
    if( this.props.tool === tool )
    {
      this.props.setTool( null );
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
