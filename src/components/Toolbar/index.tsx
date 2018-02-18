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
          <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem', fill: drawingTypeColors[ DrawingType.Above ] }}>
            <path d={UP_ARROW_PATH} />
          </svg>
        </ToolbarItem>

        <ToolbarItem
          title="At Constraint"
          active={this.props.tool === DrawingType.At}
          onClick={() => this.onToolClick( DrawingType.At )}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem', marginBottom: '-20px', fill: drawingTypeColors[ DrawingType.At ] }}>
              <path d={DOWN_ARROW_PATH} />
            </svg>
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem', fill: drawingTypeColors[ DrawingType.At ] }}>
              <path d={UP_ARROW_PATH} />
            </svg>
          </div>
        </ToolbarItem>

        <ToolbarItem
          title="Below Constraint"
          active={this.props.tool === DrawingType.Below}
          onClick={() => this.onToolClick( DrawingType.Below )}
        >
          <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem', fill: drawingTypeColors[ DrawingType.Below ] }}>
            <path d={DOWN_ARROW_PATH} />
          </svg>
        </ToolbarItem>

        <ToolbarItem
          title="Between Constraint"
          active={this.props.tool === DrawingType.Between}
          onClick={() => this.onToolClick( DrawingType.Between )}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem', marginBottom: '-8px', fill: drawingTypeColors[ DrawingType.Between ] }}>
              <path d={DOWN_ARROW_PATH} />
            </svg>
            <svg viewBox="0 0 100 100" style={{ width: '2rem', height: '2rem', fill: drawingTypeColors[ DrawingType.Between ] }}>
              <path d={UP_ARROW_PATH} />
            </svg>
          </div>
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
