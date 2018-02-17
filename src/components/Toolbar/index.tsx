import * as React from 'react';

import ToolbarItem from 'components/Toolbar/ToolbarItem';

import './styles.css';

const arrow = require( '../../assets/arrow.svg' );

export default class Toolbar extends React.Component
{
  render()
  {
    return (
      <div className="toolbar">
        <ToolbarItem title="Above">
          <img src={arrow} style={{ width: '2rem', height: '2rem', transform: 'rotate( 180deg )' }} />
        </ToolbarItem>
        <ToolbarItem title="At">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <img src={arrow} style={{ width: '2rem', height: '2rem', marginBottom: '-20px' }} />
            <img src={arrow} style={{ width: '2rem', height: '2rem', transform: 'rotate( 180deg )' }} />
          </div>
        </ToolbarItem>
        <ToolbarItem title="Below">
          <img src={arrow} style={{ width: '2rem', height: '2rem' }} />
        </ToolbarItem>
        <ToolbarItem title="Between">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <img src={arrow} style={{ width: '2rem', height: '2rem', marginBottom: '-8px' }} />
            <img src={arrow} style={{ width: '2rem', height: '2rem', transform: 'rotate( 180deg )' }} />
          </div>
        </ToolbarItem>
      </div>
    );
  }
}
