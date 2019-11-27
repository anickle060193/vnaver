import React from 'react';
import { Tooltip } from '@material-ui/core';

import './styles.css';

interface Props
{
  title: string;
  shortcut: string | null;
  active: boolean;
  onClick: () => void;
}

export default class ToolbarItem extends React.Component<Props>
{
  public render()
  {
    return (
      <Tooltip
        placement="right"
        title={this.props.title + ( this.props.shortcut ? ` (${this.props.shortcut})` : '' )}
      >
        <div
          className={[
            'toolbar-item',
            this.props.active ? 'toolbar-item-active' : ''
          ].join( ' ' )}
          onClick={this.props.onClick}
        >
          {this.props.children}
        </div>
      </Tooltip>
    );
  }
}
