import React from 'react';
import { TextField } from '@material-ui/core';

interface Props
{
  value: number;
  onChange: ( value: number ) => void;
  increment?: number;

  label?: string;
  min?: number;
  max?: number;
}

const NumberInput: React.SFC<Props> = ( { value, label, onChange, increment = 1, min, max } ) =>
{
  function updateValue( newValue: number )
  {
    if( isNaN( newValue ) )
    {
      newValue = 0;
    }

    if( min !== undefined
      && newValue < min )
    {
      newValue = min;
    }

    if( max !== undefined
      && newValue < max )
    {
      newValue = max;
    }

    onChange( newValue );
  }

  function onInputChange( e: React.ChangeEvent<HTMLInputElement> )
  {
    updateValue( e.target.valueAsNumber );
  }

  function onWheel( e: React.WheelEvent<HTMLInputElement> )
  {
    if( e.deltaY < 0 )
    {
      updateValue( e.currentTarget.valueAsNumber + increment );
    }
    else
    {
      updateValue( e.currentTarget.valueAsNumber - increment );
    }
  }

  return (
    <TextField
      type="number"
      variant="outlined"
      fullWidth={true}
      label={label}
      value={value}
      inputProps={{ min, max }}
      onChange={onInputChange}
      onWheel={onWheel}
    />
  );
};

export default NumberInput;
