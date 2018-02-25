import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './styles.css';

interface Props
{
  show: boolean;
  onClose: () => void;
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
      state: 'hidden'
    };
  }

  componentWillReceiveProps( newProps: Props )
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

  render()
  {
    return ReactDOM.createPortal(
      <div
        className={[
          'dialog-shade',
          'dialog-' + this.state.state
        ].join( ' ' )}
        onClick={this.onClose}
        onAnimationEnd={this.onAnimationEnd}
      >
        <div className="dialog">
          {this.props.children}
        </div>
      </div>,
      document.body
    );
  }

  private onClose = ( e: React.MouseEvent<HTMLElement> ) =>
  {
    if( e.target === e.currentTarget )
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
