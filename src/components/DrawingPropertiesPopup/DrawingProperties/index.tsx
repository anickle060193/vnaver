import * as React from 'react';

import
{
  BasicDrawing,
  DrawingType,
  DrawingBase,
  BetweenDrawing,
  VerticalGridLineDrawing,
  HorizontalGridLineDrawing,
  BasicDrawingTypes,
  Drawing
} from 'utils/draw';

interface DrawingPropertiesProps<S extends DrawingType, T extends DrawingBase<S>>
{
  drawing: T;
  onChange: ( newDrawing: Drawing ) => void;
}

const XInput: React.SFC<{
  x: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}> = ( { x, onChange } ) => (
  <div className="form-group row">
    <label className="col-sm-2 col-form-label">X:</label>
    <div className="col-sm-10">
      <input type="number" className="form-control" placeholder="X" value={x} onChange={onChange} />
    </div>
  </div>
);

const YInput: React.SFC<{
  y: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}> = ( { y, onChange } ) => (
  <div className="form-group row">
    <label className="col-sm-2 col-form-label">Y:</label>
    <div className="col-sm-10">
      <input type="number" className="form-control" placeholder="Y" value={y} onChange={onChange} />
    </div>
  </div>
);

const XyInputs: React.SFC<{
  x: number;
  y: number;
  onXChange: React.ChangeEventHandler<HTMLInputElement>;
  onYChange: React.ChangeEventHandler<HTMLInputElement>;
}> = ( { x, y, onXChange, onYChange } ) => (
  <>
    <XInput x={x} onChange={onXChange} />
    <YInput y={y} onChange={onYChange} />
  </>
);

const GuideLineInputs: React.SFC<{
  showGuideLine: boolean;
  onShowGuideLineChange: React.ChangeEventHandler<HTMLInputElement>;
}> = ( { showGuideLine, onShowGuideLineChange } ) => (
  <div className="form-check form-check-inline">
    <label className="col-form-label mr-2">Show Guide Line:</label>
    <input type="checkbox" className="form-check-input" checked={showGuideLine} onChange={onShowGuideLineChange} />
  </div>
);

const ColorInput: React.SFC<{
  color: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}> = ( { color, onChange } ) => (
  <div className="form-group row">
    <label className="col-sm-2 col-form-label">Color:</label>
    <div className="col-sm-10">
      <input type="color" className="form-control" style={{ height: '2.5rem', padding: '0.2rem 0.3rem' }} value={color} onChange={onChange} />
    </div>
  </div>
);

export class BasicDrawingProperties extends React.Component<DrawingPropertiesProps<BasicDrawingTypes, BasicDrawing<BasicDrawingTypes>>>
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
          onChange={this.onColorChange}
        />
        <GuideLineInputs
          showGuideLine={this.props.drawing.showGuideLine}
          onShowGuideLineChange={this.onShowGuideLineChange}
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

  private onShowGuideLineChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      showGuideLine: e.target.checked
    } );
  }

  private onColorChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      color: e.target.value
    } );
  }
}

export class BetweenDrawingProperties extends React.Component<DrawingPropertiesProps<DrawingType.Between, BetweenDrawing>>
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
        <ColorInput
          color={this.props.drawing.color}
          onChange={this.onColorChange}
        />
        <GuideLineInputs
          showGuideLine={this.props.drawing.showGuideLine}
          onShowGuideLineChange={this.onShowGuideLineChange}
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

  private onHeightChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      height: e.target.valueAsNumber || 0
    } );
  }

  private onShowGuideLineChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      showGuideLine: e.target.checked
    } );
  }

  private onColorChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      color: e.target.value
    } );
  }
}

export class VerticalGridLineDrawingProperties extends React.Component<DrawingPropertiesProps<DrawingType.VerticalGridLine, VerticalGridLineDrawing>>
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
          onChange={this.onColorChange}
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

  private onColorChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      color: e.target.value
    } );
  }
}

export class HorizontalGridLineDrawingProperties extends React.Component<DrawingPropertiesProps<DrawingType.HorizontalGridLine, HorizontalGridLineDrawing>>
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
          onChange={this.onColorChange}
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

  private onColorChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      color: e.target.value
    } );
  }
}
