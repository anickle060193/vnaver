import * as React from 'react';
import { connect } from 'react-redux';

import NumberInput from 'components/NumberInput';
import
{
  BasicDrawing,
  BetweenDrawing,
  VerticalGridLineDrawing,
  HorizontalGridLineDrawing,
  BasicDrawingTypes,
  Drawing,
  PlaneDrawing,
  PathLineDrawing,
  DrawingMap,
  drawingToolDisplayNames,
  getEndPointPosition,
  LineStyle,
  dashStyles,
  LineDashStyle,
  TextDrawing,
  HorizontalAlign,
  VerticalAlign
} from 'utils/draw';
import { selectDrawing } from 'store/reducers/drawings';

type DrawingChangeEventHandler<D extends Drawing> = ( newDrawing: D ) => void;

interface Props<D extends Drawing>
{
  drawing: D;
  onColorChange: ( newColor: string ) => void;
  onChange: DrawingChangeEventHandler<D>;
}

class DrawingPropertiesComponent<D extends Drawing> extends React.Component<Props<D>> { }

type NumberInputRowChangeHandler = ( value: number ) => void;

const NumberInputRow: React.SFC<{
  value: number;
  label: string;
  labelWidth?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  onChange: NumberInputRowChangeHandler;
}> = ( { value, label, labelWidth = 3, onChange } ) => (
  <div className="form-group row">
    <label className={`col-sm-${labelWidth} col-form-label`}>{label}:</label>
    <div className={`col-sm-${12 - labelWidth}`}>
      <NumberInput
        className="form-control"
        placeholder={label}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

const XInput: React.SFC<{
  x: number;
  onChange: NumberInputRowChangeHandler;
}> = ( { x, onChange } ) => (
  <NumberInputRow value={x} label="X" onChange={onChange} />
);

const YInput: React.SFC<{
  y: number;
  onChange: NumberInputRowChangeHandler;
}> = ( { y, onChange } ) => (
  <NumberInputRow value={y} label="Y" onChange={onChange} />
);

const XyInputs: React.SFC<{
  x: number;
  y: number;
  onXChange: NumberInputRowChangeHandler;
  onYChange: NumberInputRowChangeHandler;
}> = ( { x, y, onXChange, onYChange } ) => (
  <>
    <XInput x={x} onChange={onXChange} />
    <YInput y={y} onChange={onYChange} />
  </>
);

type LineStyleChangeEventHandler = ( lineStyleUpdate: Partial<LineStyle> ) => void;

const LineStyleInputs: React.SFC<LineStyle & {
  onLineStyleChange: LineStyleChangeEventHandler;
}> = ( { dash, strokeWidth, onLineStyleChange } ) => (
  <>
    <NumberInputRow
      label="Width"
      value={strokeWidth}
      onChange={( s ) => onLineStyleChange( { strokeWidth: s } )}
    />
    <div className="form-group row">
      <label className="col-sm-3 col-form-label">Dash:</label>
      <div className="col-sm-9">
        <select
          className="form-control"
          value={dash}
          onChange={( e ) => onLineStyleChange( { dash: e.target.value as LineDashStyle } )}
        >
          {Object.keys( dashStyles ).map( ( dashStyle ) => (
            <option key={dashStyle} value={dashStyle}>{dashStyle}</option>
          ) )}
        </select>
      </div>
    </div>
  </>
);

const GuideLineInputs: React.SFC<LineStyle & {
  showGuideLine: boolean;
  onShowGuideLineChange: ( showGuideLine: boolean ) => void;
  onLineStyleChange: LineStyleChangeEventHandler;
}> = ( { showGuideLine, onShowGuideLineChange, dash, strokeWidth, onLineStyleChange } ) => (
  <>
    <div className="form-check">
      <label className="form-check-label mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          checked={showGuideLine}
          onChange={( e ) => onShowGuideLineChange( e.target.checked )}
        />
        Show Guide Line
    </label>
    </div>
    <LineStyleInputs
      dash={dash}
      strokeWidth={strokeWidth}
      onLineStyleChange={onLineStyleChange}
    />
  </>
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
          dash={this.props.drawing.guideLine.dash}
          strokeWidth={this.props.drawing.guideLine.strokeWidth}
          onLineStyleChange={this.onLineStyleChange}
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

  private onLineStyleChange = ( lineStyle: LineStyle ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      guideLine: {
        ...this.props.drawing.guideLine,
        ...lineStyle
      }
    } );
  }
}

export class BetweenDrawingProperties extends DrawingPropertiesComponent<BetweenDrawing>
{
  render()
  {
    return (
      <form>
        <XyInputs
          x={this.props.drawing.x}
          y={this.props.drawing.y}
          onXChange={this.onXChange}
          onYChange={this.onYChange}
        />
        <NumberInputRow
          value={this.props.drawing.height}
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
          dash={this.props.drawing.guideLine.dash}
          strokeWidth={this.props.drawing.guideLine.strokeWidth}
          onLineStyleChange={this.onLineStyleChange}
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

  private onLineStyleChange = ( lineStyle: LineStyle ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      guideLine: {
        ...this.props.drawing.guideLine,
        ...lineStyle
      }
    } );
  }
}

export class VerticalGridLineDrawingProperties extends DrawingPropertiesComponent<VerticalGridLineDrawing>
{
  render()
  {
    return (
      <form>
        <XInput
          x={this.props.drawing.x}
          onChange={this.onXChange}
        />
        <ColorInput
          color={this.props.drawing.color}
          onChange={this.props.onColorChange}
        />
        <LineStyleInputs
          dash={this.props.drawing.dash}
          strokeWidth={this.props.drawing.strokeWidth}
          onLineStyleChange={this.onLineStyleChange}
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

  private onLineStyleChange = ( lineStyle: LineStyle ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      ...lineStyle
    } );
  }
}

export class HorizontalGridLineDrawingProperties extends DrawingPropertiesComponent<HorizontalGridLineDrawing>
{
  render()
  {
    return (
      <form>
        <YInput
          y={this.props.drawing.y}
          onChange={this.onYChange}
        />
        <ColorInput
          color={this.props.drawing.color}
          onChange={this.props.onColorChange}
        />
        <LineStyleInputs
          dash={this.props.drawing.dash}
          strokeWidth={this.props.drawing.strokeWidth}
          onLineStyleChange={this.onLineStyleChange}
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

  private onLineStyleChange = ( lineStyle: LineStyle ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      ...lineStyle
    } );
  }
}

export class PlaneDrawingProperties extends DrawingPropertiesComponent<PlaneDrawing>
{
  render()
  {
    return (
      <form>
        <XyInputs
          x={this.props.drawing.x}
          y={this.props.drawing.y}
          onXChange={this.onXChange}
          onYChange={this.onYChange}
        />
        <NumberInputRow
          value={this.props.drawing.size}
          label="Size"
          onChange={this.onSizeChange}
        />
        <NumberInputRow
          value={this.props.drawing.rotation}
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

interface EndPointDrawingPropertiesPropsFromState
{
  drawings: DrawingMap;
}

interface EndPointDrawingPropertiesPropsFromDispatch
{
  selectDrawing: typeof selectDrawing;
}

interface EndPointDrawingPropertiesOwnProps
{
  start: boolean;
  drawing: PathLineDrawing;
  onDrawingChange: DrawingChangeEventHandler<PathLineDrawing>;
}

type EndPointDrawingPropertiesProps = EndPointDrawingPropertiesPropsFromState & EndPointDrawingPropertiesPropsFromDispatch & EndPointDrawingPropertiesOwnProps;

const endPointConnecter = connect<EndPointDrawingPropertiesPropsFromState, EndPointDrawingPropertiesPropsFromDispatch, EndPointDrawingPropertiesOwnProps, RootState>(
  ( state ) => ( {
    drawings: state.drawings.present.drawings
  } ),
  {
    selectDrawing
  }
);

const EndPointDrawingProperties = endPointConnecter( class extends React.Component<EndPointDrawingPropertiesProps>
{
  render()
  {
    let endPoint = this.props.start ? this.props.drawing.start : this.props.drawing.end;

    if( endPoint.connected )
    {
      let anchorId = endPoint.anchorId;
      let anchor = this.props.drawings[ anchorId ];
      return (
        <div className="d-flex flex-row align-items-center mb-2">
          <b style={{ color: anchor.color }}>{drawingToolDisplayNames[ anchor.type ]}</b>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary ml-2"
            onClick={() => this.props.selectDrawing( anchorId )}
          >
            Select
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-warning ml-2"
            onClick={this.onMakeAbsoluteClick}
          >
            Make Absolute
          </button>
        </div>
      );
    }
    else
    {
      return (
        <XyInputs
          x={endPoint.x}
          y={endPoint.y}
          onXChange={this.onXChange}
          onYChange={this.onYChange}
        />
      );
    }
  }

  private onMakeAbsoluteClick = () =>
  {
    let drawing = this.props.drawing;

    if( this.props.start )
    {
      if( drawing.start.connected )
      {
        let start = getEndPointPosition( drawing.start, this.props.drawings );
        if( start )
        {
          this.props.onDrawingChange( {
            ...drawing,
            start: {
              connected: false,
              x: start.x,
              y: start.y
            }
          } );
        }
      }
    }
    else
    {
      if( drawing.end.connected )
      {
        let end = getEndPointPosition( drawing.end, this.props.drawings );
        if( end )
        {
          this.props.onDrawingChange( {
            ...drawing,
            end: {
              connected: false,
              x: end.x,
              y: end.y
            }
          } );
        }
      }
    }
  }

  private onXChange = ( x: number ) =>
  {
    let drawing = this.props.drawing;

    if( this.props.start )
    {
      if( !drawing.start.connected )
      {
        this.props.onDrawingChange( {
          ...drawing,
          start: {
            ...drawing.start,
            x
          }
        } );
      }
    }
    else
    {
      if( !drawing.end.connected )
      {
        this.props.onDrawingChange( {
          ...drawing,
          end: {
            ...drawing.end,
            x
          }
        } );
      }
    }
  }

  private onYChange = ( y: number ) =>
  {
    let drawing = this.props.drawing;

    if( this.props.start )
    {
      if( !drawing.start.connected )
      {
        this.props.onDrawingChange( {
          ...drawing,
          start: {
            ...drawing.start,
            y
          }
        } );
      }
    }
    else
    {
      if( !drawing.end.connected )
      {
        this.props.onDrawingChange( {
          ...drawing,
          end: {
            ...drawing.end,
            y
          }
        } );
      }
    }
  }
} );

export class PathLineDrawingProperties extends DrawingPropertiesComponent<PathLineDrawing>
{
  render()
  {
    return (
      <form>
        <b>Start:</b>
        <EndPointDrawingProperties
          start={true}
          drawing={this.props.drawing}
          onDrawingChange={this.props.onChange}
        />
        <b>End:</b>
        <EndPointDrawingProperties
          start={false}
          drawing={this.props.drawing}
          onDrawingChange={this.props.onChange}
        />
        <ColorInput
          color={this.props.drawing.color}
          onChange={this.props.onColorChange}
        />
        <LineStyleInputs
          dash={this.props.drawing.dash}
          strokeWidth={this.props.drawing.strokeWidth}
          onLineStyleChange={this.onLineStyleChange}
        />
      </form>
    );
  }

  private onLineStyleChange = ( lineStyle: LineStyle ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      ...lineStyle
    } );
  }
}

export class TextDrawingProperties extends DrawingPropertiesComponent<TextDrawing>
{
  render()
  {
    return (
      <form>

        <div className="form-group">
          <textarea
            className="form-control"
            rows={4}
            cols={35}
            value={this.props.drawing.text}
            onChange={this.onTextChange}
          />
        </div>

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

        <NumberInputRow
          label="Font Size"
          labelWidth={6}
          value={this.props.drawing.fontSize}
          onChange={this.onFontSizeChange}
        />

        <div className="form-group row">
          <label className="col-sm-6 col-form-label">Horizontal Align:</label>
          <div className="col-sm-6">
            <select
              className="form-control"
              value={this.props.drawing.horizontalAlign}
              onChange={this.onHorizontalAlignChange}
            >
              {Object.keys( HorizontalAlign ).map( ( horizontalAlign ) => (
                <option key={horizontalAlign} value={horizontalAlign}>{horizontalAlign}</option>
              ) )}
            </select>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-6 col-form-label">Vertical Align:</label>
          <div className="col-sm-6">
            <select
              className="form-control"
              value={this.props.drawing.verticalAlign}
              onChange={this.onVerticalAlignChange}
            >
              {Object.keys( VerticalAlign ).map( ( verticalAlign ) => (
                <option key={verticalAlign} value={verticalAlign}>{verticalAlign}</option>
              ) )}
            </select>
          </div>
        </div>

      </form>
    );
  }

  private onTextChange = ( e: React.ChangeEvent<HTMLTextAreaElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      text: e.target.value
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

  private onFontSizeChange = ( fontSize: number ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      fontSize
    } );
  }

  private onHorizontalAlignChange = ( e: React.ChangeEvent<HTMLSelectElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      horizontalAlign: e.target.value as HorizontalAlign
    } );
  }

  private onVerticalAlignChange = ( e: React.ChangeEvent<HTMLSelectElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      verticalAlign: e.target.value as VerticalAlign
    } );
  }
}
