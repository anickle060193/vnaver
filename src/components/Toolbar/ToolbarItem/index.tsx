import * as React from 'react';

import Tooltip from 'components/Tooltip';

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
  render()
  {
    return (
      <div
        className={[
          'toolbar-item',
          this.props.active ? 'toolbar-item-active' : ''
        ].join( ' ' )}
        onClick={this.props.onClick}
      >
        <Tooltip align="right" title={this.props.title + ( this.props.shortcut ? ` (${this.props.shortcut})` : '' )} />
        {this.props.children}
      </div>
    );
  }
}
