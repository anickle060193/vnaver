import React, { useEffect } from 'react';
import { Popover, Button, makeStyles, createStyles } from '@material-ui/core';
import { ChromePicker, ColorResult } from 'react-color';

interface StyleProps
{
  color: string;
}

const useStyles = makeStyles( ( theme ) => createStyles( {
  button: ( { color }: StyleProps ) => ( {
    minWidth: '2rem',
    minHeight: '2rem',
    backgroundColor: color,
    '&:hover': {
      backgroundColor: theme.palette.augmentColor( { main: color } ).dark
    },
  } ),
} ) );

interface Props
{
  color: string;
  onChange: ( color: string ) => void;
}

const ColorPicker: React.SFC<Props> = ( { color, onChange } ) =>
{
  const styles = useStyles( { color } );

  const [ anchorEl, setAnchorEl ] = React.useState<HTMLElement>();
  const [ localColor, setLocalColor ] = React.useState<string>( color );

  useEffect( () =>
  {
    setLocalColor( color );
  }, [ color ] );

  function onColorChange( c: ColorResult )
  {
    setLocalColor( c.hex );
  }

  function onClose()
  {
    setAnchorEl( undefined );

    onChange( localColor );
  }

  return (
    <>
      <Button
        className={styles.button}
        variant="contained"
        onClick={( e ) => setAnchorEl( e.currentTarget )}
      >
        {''}
      </Button>
      <Popover
        open={!!anchorEl}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
      >
        <ChromePicker
          color={localColor}
          onChange={onColorChange}
        />
      </Popover>
    </>
  );
};

export default ColorPicker;
