import * as React from 'react';

import DocumentTabs from 'components/DocumentTabs';
import Toolbar from 'components/Toolbar';
import DrawField from 'components/DrawField';
import DrawingPropertiesPopup from 'components/DrawingPropertiesPopup';
import DrawFieldControls from 'components/DrawFieldControls';

import './styles.css';

export default class Layout extends React.Component
{
  render()
  {
    return (
      <div className="main-layout">
        <DocumentTabs />
        <div className="document-layout">
          <div className="draw-field-container">
            <DrawField />
          </div>
          <div className="toolbar-container">
            <Toolbar />
          </div>
          <div className="drawing-properties-container">
            <DrawingPropertiesPopup />
          </div>
          <div className="draw-field-controls">
            <DrawFieldControls />
          </div>
        </div>
      </div>
    );
  }
}
