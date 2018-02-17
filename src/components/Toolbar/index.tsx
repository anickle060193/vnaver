import * as React from 'react';
import { connect } from 'react-redux';

import ToolbarItem from 'components/Toolbar/ToolbarItem';
import { setTool } from 'store/reducers/drawing';
import { DrawingType, DrawingTool } from 'utils/draw';

import './styles.css';

const upArrow = require( 'assets/up_arrow.svg' );
const downArrow = require( 'assets/down_arrow.svg' );

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
          title="Above"
          active={this.props.tool === DrawingType.Above}
          onClick={() => this.props.setTool( DrawingType.Above )}
        >
          <img src={upArrow} style={{ width: '2rem', height: '2rem' }} />
        </ToolbarItem>

        <ToolbarItem
          title="At"
          active={this.props.tool === DrawingType.At}
          onClick={() => this.props.setTool( DrawingType.At )}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <img src={downArrow} style={{ width: '2rem', height: '2rem', marginBottom: '-20px' }} />
            <img src={upArrow} style={{ width: '2rem', height: '2rem' }} />
          </div>
        </ToolbarItem>

        <ToolbarItem
          title="Below"
          active={this.props.tool === DrawingType.Below}
          onClick={() => this.props.setTool( DrawingType.Below )}
        >
          <img src={downArrow} style={{ width: '2rem', height: '2rem' }} />
        </ToolbarItem>

        <ToolbarItem
          title="Between"
          active={this.props.tool === DrawingType.Between}
          onClick={() => this.props.setTool( DrawingType.Between )}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <img src={downArrow} style={{ width: '2rem', height: '2rem', marginBottom: '-8px' }} />
            <img src={upArrow} style={{ width: '2rem', height: '2rem' }} />
          </div>
        </ToolbarItem>
      </div>
    );
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
