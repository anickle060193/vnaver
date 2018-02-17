import * as React from 'react';

import Toolbar from 'components/Toolbar';
import DrawField from 'components/DrawField';

import './styles.css';

export default class Layout extends React.Component
{
  render()
  {
    return (
      <div className="layout">
        <div className="draw-field-container">
          <DrawField />
        </div>
        <div className="toolbar-container">
          <Toolbar />
        </div>
      </div>
    );
  }
}
