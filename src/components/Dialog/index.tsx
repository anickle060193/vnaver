import React from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

interface Props
{
  show: boolean;
  closeOnShadeClick: boolean;
  onClose: () => void;

  style?: React.CSSProperties;
}

interface State
{
  state: 'showing' | 'show' | 'hiding' | 'hidden';
}

export default class Dialog extends React.Component<Props, State>
{
  constructor( props: Props )
  {
    super( props );

    this.state = {
      state: this.props.show ? 'show' : 'hidden'
    };
  }

  public componentWillReceiveProps( newProps: Props )
  {
    if( newProps.show !== this.props.show )
    {
      if( newProps.show )
      {
        this.setState( { state: 'showing' } );
      }
      else
      {
        this.setState( { state: 'hiding' } );
      }
    }
  }

  public render()
  {
    return ReactDOM.createPortal(
      (
        <div
          className={[
            'dialog-shade',
            'dialog-' + this.state.state
          ].join( ' ' )}
          onClick={this.onShadeClick}
          onAnimationEnd={this.onAnimationEnd}
        >
          <div className="dialog" style={this.props.style}>
            {this.props.children}
          </div>
        </div>
      ),
      document.body
    );
  }

  private onShadeClick = ( e: React.MouseEvent<HTMLElement> ) =>
  {
    if( this.props.closeOnShadeClick
      && e.target === e.currentTarget )
    {
      this.props.onClose();
    }
  }

  private onAnimationEnd = ( e: React.AnimationEvent<HTMLElement> ) =>
  {
    if( e.animationName === 'slide-in' )
    {
      this.setState( { state: 'show' } );
    }
    else if( e.animationName === 'slide-out' )
    {
      this.setState( { state: 'hidden' } );
    }
  }
}
