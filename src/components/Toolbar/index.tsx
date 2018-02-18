import * as React from 'react';
import { connect } from 'react-redux';

import ToolbarItem from 'components/Toolbar/ToolbarItem';
import { setTool } from 'store/reducers/drawing';
import { DrawingType, Tool, DrawingTool } from 'utils/draw';

import './styles.css';

const upArrow = require( 'assets/up_arrow.svg' );
const downArrow = require( 'assets/down_arrow.svg' );
const move = require( 'assets/move.svg' );

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
          <img src={move} style={{ width: '2.5rem', height: '2.5rem' }} />
        </ToolbarItem>

        <ToolbarItem
          title="Above Constraint"
          active={this.props.tool === DrawingType.Above}
          onClick={() => this.onToolClick( DrawingType.Above )}
        >
          <img src={upArrow} style={{ width: '2rem', height: '2rem' }} />
        </ToolbarItem>

        <ToolbarItem
          title="At Constraint"
          active={this.props.tool === DrawingType.At}
          onClick={() => this.onToolClick( DrawingType.At )}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <img src={downArrow} style={{ width: '2rem', height: '2rem', marginBottom: '-20px' }} />
            <img src={upArrow} style={{ width: '2rem', height: '2rem' }} />
          </div>
        </ToolbarItem>

        <ToolbarItem
          title="Below Constraint"
          active={this.props.tool === DrawingType.Below}
          onClick={() => this.onToolClick( DrawingType.Below )}
        >
          <img src={downArrow} style={{ width: '2rem', height: '2rem' }} />
        </ToolbarItem>

        <ToolbarItem
          title="Between Constraint"
          active={this.props.tool === DrawingType.Between}
          onClick={() => this.onToolClick( DrawingType.Between )}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <img src={downArrow} style={{ width: '2rem', height: '2rem', marginBottom: '-8px' }} />
            <img src={upArrow} style={{ width: '2rem', height: '2rem' }} />
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
