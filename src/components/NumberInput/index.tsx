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

export default class NumberInput extends React.Component<Props>
{
  public static defaultProps: Partial<Props> = {
    increment: 1
  };

  public render()
  {
    return (
      <input
        type="number"
        value={this.props.value}
        placeholder={this.props.placeholder}
        className={this.props.className}
        style={this.props.style}
        min={this.props.min}
        max={this.props.max}
        onChange={this.onChange}
        onWheel={this.onWheel}
      />
    );
  }

  private updateValue( value: number )
  {
    if( isNaN( value ) )
    {
      value = 0;
    }

    if( this.props.min !== undefined
      && value < this.props.min )
    {
      value = this.props.min;
    }

    if( this.props.max !== undefined
      && value < this.props.max )
    {
      value = this.props.max;
    }

    this.props.onChange( value );
  }

  private onChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.updateValue( e.target.valueAsNumber );
  }

  private onWheel = ( e: React.WheelEvent<HTMLInputElement> ) =>
  {
    if( e.deltaY < 0 )
    {
      this.updateValue( e.currentTarget.valueAsNumber + this.props.increment! );
    }
    else
    {
      this.updateValue( e.currentTarget.valueAsNumber - this.props.increment! );
    }
  }
}
