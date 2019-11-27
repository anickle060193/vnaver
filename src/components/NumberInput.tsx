import React from 'react';

interface Props
{
  value: number;
  onChange: ( value: number ) => void;
  increment?: number;

  className?: string;
  placeholder?: string;
  style?: React.StyleHTMLAttributes<HTMLInputElement>;
  min?: number;
  max?: number;
}

const NumberInput: React.SFC<Props> = ( { value, className, placeholder, style, onChange, increment = 1, min, max } ) =>
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
    <input
      type="number"
      value={value}
      placeholder={placeholder}
      className={className}
      style={style}
      min={min}
      max={max}
      onChange={onInputChange}
      onWheel={onWheel}
    />
  );
};

export default NumberInput;
