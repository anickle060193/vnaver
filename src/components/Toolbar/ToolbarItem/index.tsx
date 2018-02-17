import * as React from 'react';

import Tooltip from 'components/Tooltip';

import './styles.css';

interface Props
{
  title: string;
}

export default class ToolbarItem extends React.Component<Props>
{
  render()
  {
    return (
      <Tooltip className="toolbar-item" title={this.props.title}>
        {this.props.children}
      </Tooltip>
    );
  }
}
