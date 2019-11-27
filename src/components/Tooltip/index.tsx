import React from 'react';

import './styles.css';

interface Props extends React.HTMLProps<HTMLDivElement>
{
  title: string;
  align: 'left' | 'right' | 'bottom';
}

interface State
{
  show: boolean;
}

export default class Tooltip extends React.Component<Props, State>
{
  constructor( props: Props )
  {
    super( props );

    this.state = {
      show: false
    };
  }

  public render()
  {
    let { title, align } = this.props;

    return (
      <div
        className="tooltip-container"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <span
          className={[
            'tooltip-item',
            'tooltip-item-' + align,
            this.state.show ? 'tooltip-show' : ''
          ].join( ' ' )}
        >
          {title}
        </span>
      </div>
    );
  }

  private onMouseEnter = () =>
  {
    this.setState( { show: true } );
  }

  private onMouseLeave = () =>
  {
    this.setState( { show: false } );
  }
}
