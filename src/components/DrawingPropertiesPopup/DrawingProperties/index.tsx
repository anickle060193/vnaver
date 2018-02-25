import * as React from 'react';

import
{
  BasicDrawing,
  BetweenDrawing,
  VerticalGridLineDrawing,
  HorizontalGridLineDrawing,
  BasicDrawingTypes,
  Drawing,
  PlaneDrawing
} from 'utils/draw';

interface Props<D extends Drawing>
{
  drawing: D;
  onColorChange: ( newColor: string ) => void;
  onChange: ( newDrawing: D ) => void;
}

class DrawingPropertiesComponent<D extends Drawing> extends React.Component<Props<D>> { }

type NumberInputChangeHandler = ( value: number ) => void;

const NumberInput: React.SFC<{
  val: number;
  label: string;
  onChange: NumberInputChangeHandler;
}> = ( { val, label, onChange } ) => (
  <div className="form-group row">
    <label className="col-sm-3 col-form-label">{label}:</label>
    <div className="col-sm-9">
      <input
        type="number"
        className="form-control"
        placeholder={label}
        value={val}
        onChange={( e ) => onChange( e.target.valueAsNumber || 0 )}
      />
    </div>
  </div>
);

const XInput: React.SFC<{
  x: number;
  onChange: NumberInputChangeHandler;
}> = ( { x, onChange } ) => (
  <NumberInput val={x} label="X" onChange={onChange} />
);

const YInput: React.SFC<{
  y: number;
  onChange: NumberInputChangeHandler;
}> = ( { y, onChange } ) => (
  <NumberInput val={y} label="Y" onChange={onChange} />
);

const XyInputs: React.SFC<{
  x: number;
  y: number;
  onXChange: NumberInputChangeHandler;
  onYChange: NumberInputChangeHandler;
}> = ( { x, y, onXChange, onYChange } ) => (
  <>
    <XInput x={x} onChange={onXChange} />
    <YInput y={y} onChange={onYChange} />
  </>
);

const GuideLineInputs: React.SFC<{
  showGuideLine: boolean;
  onShowGuideLineChange: ( showGuideLine: boolean ) => void;
}> = ( { showGuideLine, onShowGuideLineChange } ) => (
  <div className="form-check form-check-inline">
    <label className="col-form-label mr-2 mb-2">Show Guide Line:</label>
    <input
      type="checkbox"
      className="form-check-input"
      checked={showGuideLine}
      onChange={( e ) => onShowGuideLineChange( e.target.checked )}
    />
  </div>
);

const ColorInput: React.SFC<{
  color: string;
  onChange: ( color: string ) => void;
}> = ( { color, onChange } ) => (
  <div className="form-group row">
    <label className="col-sm-3 col-form-label">Color:</label>
    <div className="col-sm-9">
      <input
        type="color"
        className="form-control"
        value={color}
        onChange={( e ) => onChange( e.target.value )}
      />
    </div>
  </div>
);

export class BasicDrawingProperties extends DrawingPropertiesComponent<BasicDrawing<BasicDrawingTypes>>
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
        <ColorInput
          color={this.props.drawing.color}
          onChange={this.props.onColorChange}
        />
        <GuideLineInputs
          showGuideLine={this.props.drawing.showGuideLine}
          onShowGuideLineChange={this.onShowGuideLineChange}
        />
      </form>
    );
  }

  private onXChange = ( x: number ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      x
    } );
  }

  private onYChange = ( y: number ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      y
    } );
  }

  private onShowGuideLineChange = ( showGuideLine: boolean ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      showGuideLine
    } );
  }
}

export class BetweenDrawingProperties extends DrawingPropertiesComponent<BetweenDrawing>
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
        <NumberInput
          val={this.props.drawing.height}
          label="Height"
          onChange={this.onHeightChange}
        />
        <ColorInput
          color={this.props.drawing.color}
          onChange={this.props.onColorChange}
        />
        <GuideLineInputs
          showGuideLine={this.props.drawing.showGuideLine}
          onShowGuideLineChange={this.onShowGuideLineChange}
        />
      </form>
    );
  }

  private onXChange = ( x: number ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      x
    } );
  }

  private onYChange = ( y: number ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      y
    } );
  }

  private onHeightChange = ( height: number ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      height
    } );
  }

  private onShowGuideLineChange = ( showGuideLine: boolean ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      showGuideLine
    } );
  }
}

export class VerticalGridLineDrawingProperties extends DrawingPropertiesComponent<VerticalGridLineDrawing>
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
        <ColorInput
          color={this.props.drawing.color}
          onChange={this.props.onColorChange}
        />
      </form>
    );
  }

  private onXChange = ( x: number ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      x
    } );
  }
}

export class HorizontalGridLineDrawingProperties extends DrawingPropertiesComponent<HorizontalGridLineDrawing>
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
        <ColorInput
          color={this.props.drawing.color}
          onChange={this.props.onColorChange}
        />
      </form>
    );
  }

  private onYChange = ( y: number ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      y
    } );
  }
}

export class PlaneDrawingProperties extends DrawingPropertiesComponent<PlaneDrawing>
{
  render()
  {
    return (
      <form>
        <b>Plane</b>
        <XInput
          x={this.props.drawing.x}
          onChange={this.onXChange}
        />
        <YInput
          y={this.props.drawing.y}
          onChange={this.onYChange}
        />
        <NumberInput
          val={this.props.drawing.size}
          label="Size"
          onChange={this.onSizeChange}
        />
        <NumberInput
          val={this.props.drawing.rotation}
          label="Rotation"
          onChange={this.onRotationChange}
        />
        <ColorInput
          color={this.props.drawing.color}
          onChange={this.props.onColorChange}
        />
      </form>
    );
  }

  private onSizeChange = ( size: number ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      size
    } );
  }

  private onRotationChange = ( rotation: number ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      rotation
    } );
  }

  private onXChange = ( x: number ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      x
    } );
  }

  private onYChange = ( y: number ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      y
    } );
  }
}
