import * as React from 'react';
import { connect } from 'react-redux';

import { BasicDrawing, DrawingType, DrawingBase, BetweenDrawing, VerticalGridLineDrawing, HorizontalGridLineDrawing, BasicDrawingTypes, Drawing } from 'utils/draw';

interface DrawingPropertiesProps<S extends DrawingType, T extends DrawingBase<S>>
{
  drawing: T;
  onChange: ( newDrawing: Drawing ) => void;
}

const connector = <T extends DrawingType, D extends DrawingBase<T>>( component: React.ComponentClass<DrawingPropertiesProps<T, D>> ) => ( connect<{}, {}, DrawingPropertiesProps<T, DrawingBase<T>>, RootState>(
  ( state ) => ( {
  } ),
  {
  }
) )( component );

const XInput: React.SFC<{
  x: number,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
}> = ( { x, onChange } ) => (
  <>
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">X:</label>
      <div className="col-sm-10">
        <input type="number" className="form-control" placeholder="X" value={x} onChange={onChange} />
      </div>
    </div>
  </>
);

const YInput: React.SFC<{
  y: number,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
}> = ( { y, onChange } ) => (
  <>
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">Y:</label>
      <div className="col-sm-10">
        <input type="number" className="form-control" placeholder="Y" value={y} onChange={onChange} />
      </div>
    </div>
  </>
);

const XyInputs: React.SFC<{
  x: number,
  y: number,
  onXChange: React.ChangeEventHandler<HTMLInputElement>,
  onYChange: React.ChangeEventHandler<HTMLInputElement>
}> = ( { x, y, onXChange, onYChange } ) => (
  <>
    <XInput x={x} onChange={onXChange} />
    <YInput y={y} onChange={onYChange} />
  </>
);

export const BasicDrawingProperties = connector( class extends React.Component<DrawingPropertiesProps<BasicDrawingTypes, BasicDrawing<BasicDrawingTypes>>>
{
  render()
  {
    return (
      <form>
        <b>{this.props.drawing.type} Constraint</b>
        <XyInputs
          x={this.props.drawing.x}
          y={this.props.drawing.y}
          onXChange={this.onXChange}
          onYChange={this.onYChange}
        />
      </form>
    );
  }

  private onXChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      x: e.target.valueAsNumber || 0
    } );
  }

  private onYChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      y: e.target.valueAsNumber || 0
    } );
  }
} );

export const BetweenDrawingProperties = connector( class extends React.Component<DrawingPropertiesProps<DrawingType.Between, BetweenDrawing>>
{
  render()
  {
    return (
      <form>
        <b>Between Constraint</b>
        <XyInputs
          x={this.props.drawing.x}
          y={this.props.drawing.y}
          onXChange={this.onXChange}
          onYChange={this.onYChange}
        />
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Height:</label>
          <div className="col-sm-10">
            <input
              type="number"
              className="form-control"
              placeholder="Height"
              value={this.props.drawing.height}
              onChange={this.onHeightChange}
            />
          </div>
        </div>
      </form>
    );
  }

  private onXChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      x: e.target.valueAsNumber || 0
    } );
  }

  private onYChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      y: e.target.valueAsNumber || 0
    } );
  }

  private onHeightChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      height: e.target.valueAsNumber || 0
    } );
  }
} );

export const VerticalGridLineDrawingProperties = connector( class extends React.Component<DrawingPropertiesProps<DrawingType.VerticalGridLine, VerticalGridLineDrawing>>
{
  render()
  {
    return (
      <form>
        <b>Vertical Grid Line</b>
        <XInput
          x={this.props.drawing.x}
          onChange={this.onXChange}
        />
      </form>
    );
  }

  private onXChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      x: e.target.valueAsNumber || 0
    } );
  }
} );

export const HorizontalGridLineDrawingProperties = connector( class extends React.Component<DrawingPropertiesProps<DrawingType.HorizontalGridLine, HorizontalGridLineDrawing>>
{
  render()
  {
    return (
      <form>
        <b>Horizontal Grid Line</b>
        <YInput
          y={this.props.drawing.y}
          onChange={this.onYChange}
        />
      </form>
    );
  }

  private onYChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      y: e.target.valueAsNumber || 0
    } );
  }
} );
