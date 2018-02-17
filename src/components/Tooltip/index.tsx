import * as React from 'react';

import './styles.css';

interface Props extends React.HTMLProps<HTMLDivElement>
{
  title: string;
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

  render()
  {
    let { title, style, ...props } = this.props;
    return (
      <div
        {...props}
        style={{
          ...style,
          position: 'relative'
        }}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {props.children}

        <span
          className={[
            'tooltip',
            this.state.show ? 'show' : ''
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
