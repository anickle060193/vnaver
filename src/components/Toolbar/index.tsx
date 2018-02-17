import * as React from 'react';
import { connect } from 'react-redux';

import ToolbarItem from 'components/Toolbar/ToolbarItem';
import { setTool } from 'store/reducers/drawing';
import { Tool } from 'utils/draw';

import './styles.css';

const upArrow = require( 'assets/up_arrow.svg' );
const downArrow = require( 'assets/down_arrow.svg' );

interface PropsFromState
{
  tool: Tool | null;
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
          active={this.props.tool === Tool.Above}
          onClick={() => this.props.setTool( Tool.Above )}
        >
          <img src={upArrow} style={{ width: '2rem', height: '2rem' }} />
        </ToolbarItem>

        <ToolbarItem
          title="At"
          active={this.props.tool === Tool.At}
          onClick={() => this.props.setTool( Tool.At )}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <img src={downArrow} style={{ width: '2rem', height: '2rem', marginBottom: '-20px' }} />
            <img src={upArrow} style={{ width: '2rem', height: '2rem' }} />
          </div>
        </ToolbarItem>

        <ToolbarItem
          title="Below"
          active={this.props.tool === Tool.Below}
          onClick={() => this.props.setTool( Tool.Below )}
        >
          <img src={downArrow} style={{ width: '2rem', height: '2rem' }} />
        </ToolbarItem>

        <ToolbarItem
          title="Between"
          active={this.props.tool === Tool.Between}
          onClick={() => this.props.setTool( Tool.Between )}
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
