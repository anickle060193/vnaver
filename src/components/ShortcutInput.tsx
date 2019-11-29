import React, { useEffect } from 'react';
import { TextField, makeStyles } from '@material-ui/core';

import { getShortcutFromKeyEvent } from 'utils/shortcut';

const useStyles = makeStyles( {
  input: {
    textAlign: 'center',
    maxWidth: '10rem',
  },
} );

const noop = () => void 0;

interface Props
{
  shortcut: string;
  onChange: ( newShortcut: string ) => void;
}

const ShortcutInput: React.SFC<Props> = ( { shortcut, onChange } ) =>
{
  const styles = useStyles();

  const [ localShortcut, setLocalShortcut ] = React.useState( shortcut );

  useEffect( () =>
  {
    setLocalShortcut( shortcut );
  }, [ shortcut ] );

  function onKeyDown( e: React.KeyboardEvent<HTMLInputElement> )
  {
    if( e.key === 'Tab' )
    {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    setLocalShortcut( getShortcutFromKeyEvent( e ) );
  }

  function onBlur()
  {
    onChange( localShortcut );
  }

  return (
    <TextField
      inputProps={{
        className: styles.input,
      }}
      type="text"
      value={localShortcut}
      onChange={noop}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    />
  );
};

export default ShortcutInput;
