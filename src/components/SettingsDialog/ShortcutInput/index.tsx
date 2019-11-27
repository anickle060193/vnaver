import React from 'react';
import { getShortcutFromKeyEvent } from 'utils/shortcut';

interface Props extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange'>
{
  shortcut: string;
  onChange: ( newShortcut: string ) => void;
}

export default class ShortcutInput extends React.Component<Props>
{
  public render()
  {
    let { shortcut, style, onChange, ...inputProps } = this.props;
    return (
      <input
        {...inputProps}
        style={{
          ...style,
          textAlign: 'center'
        }}
        type="text"
        value={shortcut}
        readOnly={true}
        onKeyDown={this.onKeyDown}
      />
    );
  }

  private onKeyDown = ( e: React.KeyboardEvent<HTMLInputElement> ) =>
  {
    if( e.key === 'Tab' )
    {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    let shortcut = getShortcutFromKeyEvent( e );
    this.props.onChange( shortcut );
  }
}
