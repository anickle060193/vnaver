import * as React from 'react';
import { connect } from 'react-redux';

import ToolbarItem from 'components/Toolbar/ToolbarItem';
import { setCurrentAction } from 'store/reducers/current_action';
import { DrawAction } from 'utils/draw_action';

import './styles.css';

const arrow = require( 'assets/arrow.svg' );

interface PropsFromState
{
  currentAction: DrawAction | null;
}

interface PropsFromDispatch
{
  setCurrentAction: typeof setCurrentAction;
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
          active={this.props.currentAction === DrawAction.Above}
          onClick={() => this.props.setCurrentAction( DrawAction.Above )}
        >
          <img src={arrow} style={{ width: '2rem', height: '2rem', transform: 'rotate( 180deg )' }} />
        </ToolbarItem>

        <ToolbarItem
          title="At"
          active={this.props.currentAction === DrawAction.At}
          onClick={() => this.props.setCurrentAction( DrawAction.At )}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <img src={arrow} style={{ width: '2rem', height: '2rem', marginBottom: '-20px' }} />
            <img src={arrow} style={{ width: '2rem', height: '2rem', transform: 'rotate( 180deg )' }} />
          </div>
        </ToolbarItem>

        <ToolbarItem
          title="Below"
          active={this.props.currentAction === DrawAction.Below}
          onClick={() => this.props.setCurrentAction( DrawAction.Below )}
        >
          <img src={arrow} style={{ width: '2rem', height: '2rem' }} />
        </ToolbarItem>

        <ToolbarItem
          title="Between"
          active={this.props.currentAction === DrawAction.Between}
          onClick={() => this.props.setCurrentAction( DrawAction.Between )}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <img src={arrow} style={{ width: '2rem', height: '2rem', marginBottom: '-8px' }} />
            <img src={arrow} style={{ width: '2rem', height: '2rem', transform: 'rotate( 180deg )' }} />
          </div>
        </ToolbarItem>
      </div>
    );
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    currentAction: state.currentAction.currentAction
  } ),
  {
    setCurrentAction
  }
)( Toolbar );
