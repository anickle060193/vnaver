import * as React from 'react';

import Toolbar from 'components/Toolbar';

import './styles.css';

export default class Layout extends React.Component
{
  render()
  {
    return (
      <div className="layout">
        <div className="toolbar-pane">
          <Toolbar />
        </div>
        <div className="main-content-pane">
          {null}
        </div>
      </div>
    );
  }
}
