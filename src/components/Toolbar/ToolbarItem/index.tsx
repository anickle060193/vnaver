import * as React from 'react';

import Tooltip from 'components/Tooltip';

import './styles.css';

interface Props
{
  title: string;
  active: boolean;
  onClick: () => void;
}

export default class ToolbarItem extends React.Component<Props>
{
  render()
  {
    return (
      <Tooltip
        className={[
          'toolbar-item',
          this.props.active ? 'toolbar-item-active' : ''
        ].join( ' ' )}
        title={this.props.title}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </Tooltip>
    );
  }
}
