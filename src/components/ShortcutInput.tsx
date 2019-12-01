import React, { useEffect } from 'react';
import { TextField, makeStyles, createStyles } from '@material-ui/core';

import { getShortcutFromKeyEvent } from 'utils/shortcut';

const useStyles = makeStyles( ( theme ) => createStyles( {
  input: {
    padding: theme.spacing( 0.75, 0, 0.875 ),
    textAlign: 'center',
    maxWidth: '10rem',
  },
} ) );

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
      InputProps={{
        classes: {
          input: styles.input,
        },
      }}
      type="text"
      variant="outlined"
      value={localShortcut}
      onChange={noop}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    />
  );
};

export default ShortcutInput;
