import React from 'react';
import { connect } from 'react-redux';
import { Grid, MenuItem, TextField, FormControlLabel, Checkbox, Box, Typography, Button } from '@material-ui/core';

import NumberInput from 'components/NumberInput';
import ColorPicker from 'components/ColorPicker';

import { selectDrawing } from 'store/reducers/drawings';
import { currentDrawingsState } from 'store/selectors';

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
  VerticalAlign,
  CurvedLineDrawing
} from 'utils/draw';

type DrawingChangeEventHandler<D extends Drawing> = ( newDrawing: D ) => void;

interface Props<D extends Drawing>
{
  drawing: D;
  onColorChange: ( newColor: string ) => void;
  onChange: DrawingChangeEventHandler<D>;
}

class DrawingPropertiesComponent<D extends Drawing> extends React.Component<Props<D>> { }

type NumberInputChangeHandler = ( value: number ) => void;

const XInput: React.SFC<{
  x: number;
  onChange: NumberInputChangeHandler;
}> = ( { x, onChange } ) => (
  <NumberInput value={x} label="X" onChange={onChange} />
);

const YInput: React.SFC<{
  y: number;
  onChange: NumberInputChangeHandler;
}> = ( { y, onChange } ) => (
  <NumberInput value={y} label="Y" onChange={onChange} />
);

const XyInputs: React.SFC<{
  x: number;
  y: number;
  onXChange: NumberInputChangeHandler;
  onYChange: NumberInputChangeHandler;
}> = ( { x, y, onXChange, onYChange } ) => (
  <>
    <Grid item={true} xs={6}>
      <XInput x={x} onChange={onXChange} />
    </Grid>
    <Grid item={true} xs={6}>
      <YInput y={y} onChange={onYChange} />
    </Grid>
  </>
);

type LineStyleChangeEventHandler = ( lineStyleUpdate: Partial<LineStyle> ) => void;

const LineStyleInputs: React.SFC<LineStyle & {
  onLineStyleChange: LineStyleChangeEventHandler;
}> = ( { dash, strokeWidth, onLineStyleChange } ) => (
  <Grid item={true} xs={12} container={true} spacing={1}>
    <Grid item={true} xs={6}>
      <NumberInput
        label="Width"
        value={strokeWidth}
        onChange={( s ) => onLineStyleChange( { strokeWidth: s } )}
      />
    </Grid>
    <Grid item={true} xs={6}>
      <TextField
        label="Dash"
        fullWidth={true}
        variant="outlined"
        select={true}
        value={dash}
        onChange={( e ) => onLineStyleChange( { dash: e.target.value as LineDashStyle } )}
      >
        {Object.keys( dashStyles ).map( ( dashStyle ) => (
          <MenuItem key={dashStyle} value={dashStyle}>
            {dashStyle}
          </MenuItem>
        ) )}
      </TextField>
    </Grid>
  </Grid>
);

const GuideLineInputs: React.SFC<LineStyle & {
  showGuideLine: boolean;
  onShowGuideLineChange: ( showGuideLine: boolean ) => void;
  onLineStyleChange: LineStyleChangeEventHandler;
}> = ( { showGuideLine, onShowGuideLineChange, dash, strokeWidth, onLineStyleChange } ) => (
  <>
    <Grid item={true} xs={12}>
      <FormControlLabel
        label="Show Guide Line"
        checked={showGuideLine}
        onChange={( e, checked ) => onShowGuideLineChange( checked )}
        control={<Checkbox />}
      />
    </Grid>
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
  <Box display="flex" flexDirection="row" alignItems="center">
    <Box mr={1}>
      <Typography variant="body1" component="span">
        Color:
      </Typography>
    </Box>
    <ColorPicker
      color={color}
      onChange={onChange}
    />
  </Box>
);

export class BasicDrawingProperties extends DrawingPropertiesComponent<BasicDrawing<BasicDrawingTypes>>
{
  public render()
  {
    return (
      <Grid container={true} spacing={1}>
        <XyInputs
          x={this.props.drawing.x}
          y={this.props.drawing.y}
          onXChange={this.onXChange}
          onYChange={this.onYChange}
        />
        <Grid item={true} xs={12}>
          <ColorInput
            color={this.props.drawing.color}
            onChange={this.props.onColorChange}
          />
        </Grid>
        <GuideLineInputs
          showGuideLine={this.props.drawing.showGuideLine}
          onShowGuideLineChange={this.onShowGuideLineChange}
          dash={this.props.drawing.guideLine.dash}
          strokeWidth={this.props.drawing.guideLine.strokeWidth}
          onLineStyleChange={this.onLineStyleChange}
        />
      </Grid>
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

  private onLineStyleChange = ( lineStyle: Partial<LineStyle> ) =>
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
  public render()
  {
    return (
      <Grid container={true} spacing={1}>
        <XyInputs
          x={this.props.drawing.x}
          y={this.props.drawing.y}
          onXChange={this.onXChange}
          onYChange={this.onYChange}
        />
        <Grid item={true} xs={12}>
          <NumberInput
            value={this.props.drawing.height}
            label="Height"
            onChange={this.onHeightChange}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <ColorInput
            color={this.props.drawing.color}
            onChange={this.props.onColorChange}
          />
        </Grid>
        <GuideLineInputs
          showGuideLine={this.props.drawing.showGuideLine}
          onShowGuideLineChange={this.onShowGuideLineChange}
          dash={this.props.drawing.guideLine.dash}
          strokeWidth={this.props.drawing.guideLine.strokeWidth}
          onLineStyleChange={this.onLineStyleChange}
        />
      </Grid>
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

  private onLineStyleChange = ( lineStyle: Partial<LineStyle> ) =>
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
  public render()
  {
    return (
      <Grid container={true} spacing={1}>
        <XInput
          x={this.props.drawing.x}
          onChange={this.onXChange}
        />
        <Grid item={true} xs={12}>
          <ColorInput
            color={this.props.drawing.color}
            onChange={this.props.onColorChange}
          />
        </Grid>
        <LineStyleInputs
          dash={this.props.drawing.dash}
          strokeWidth={this.props.drawing.strokeWidth}
          onLineStyleChange={this.onLineStyleChange}
        />
      </Grid>
    );
  }

  private onXChange = ( x: number ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      x
    } );
  }

  private onLineStyleChange = ( lineStyle: Partial<LineStyle> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      ...lineStyle
    } );
  }
}

export class HorizontalGridLineDrawingProperties extends DrawingPropertiesComponent<HorizontalGridLineDrawing>
{
  public render()
  {
    return (
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={12}>
          <YInput
            y={this.props.drawing.y}
            onChange={this.onYChange}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <ColorInput
            color={this.props.drawing.color}
            onChange={this.props.onColorChange}
          />
        </Grid>
        <LineStyleInputs
          dash={this.props.drawing.dash}
          strokeWidth={this.props.drawing.strokeWidth}
          onLineStyleChange={this.onLineStyleChange}
        />
      </Grid>
    );
  }

  private onYChange = ( y: number ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      y
    } );
  }

  private onLineStyleChange = ( lineStyle: Partial<LineStyle> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      ...lineStyle
    } );
  }
}

export class PlaneDrawingProperties extends DrawingPropertiesComponent<PlaneDrawing>
{
  public render()
  {
    return (
      <Grid container={true} spacing={1}>
        <XyInputs
          x={this.props.drawing.x}
          y={this.props.drawing.y}
          onXChange={this.onXChange}
          onYChange={this.onYChange}
        />
        <Grid item={true} xs={6}>
          <NumberInput
            value={this.props.drawing.size}
            label="Size"
            onChange={this.onSizeChange}
          />
        </Grid>
        <Grid item={true} xs={6}>
          <NumberInput
            value={this.props.drawing.rotation}
            label="Rotation"
            onChange={this.onRotationChange}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <ColorInput
            color={this.props.drawing.color}
            onChange={this.props.onColorChange}
          />
        </Grid>
      </Grid>
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

type EndPointDrawingChangeEventHandler = DrawingChangeEventHandler<PathLineDrawing | CurvedLineDrawing>;

interface EndPointDrawingPropertiesOwnProps
{
  start: boolean;
  drawing: PathLineDrawing | CurvedLineDrawing;
  onDrawingChange: EndPointDrawingChangeEventHandler;
}

type EndPointDrawingPropertiesProps = EndPointDrawingPropertiesPropsFromState & EndPointDrawingPropertiesPropsFromDispatch & EndPointDrawingPropertiesOwnProps;

const endPointConnecter = connect<EndPointDrawingPropertiesPropsFromState, EndPointDrawingPropertiesPropsFromDispatch, EndPointDrawingPropertiesOwnProps, RootState>(
  ( state ) => ( {
    drawings: currentDrawingsState( state ).drawings
  } ),
  {
    selectDrawing
  }
);

const EndPointDrawingProperties = endPointConnecter( class extends React.Component<EndPointDrawingPropertiesProps>
{
  public render()
  {
    let endPoint = this.props.start ? this.props.drawing.start : this.props.drawing.end;

    if( endPoint.connected )
    {
      let anchorId = endPoint.anchorId;
      let anchor = this.props.drawings[ anchorId ];

      return (
        <Grid item={true} xs={12}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box flex={1}>
              <Typography
                variant="body1"
                component="span"
              >
                {drawingToolDisplayNames[ anchor.type ]}:
              </Typography>
            </Box>
            <Box mx={1}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => this.props.selectDrawing( anchorId )}
              >
                Select
              </Button>
            </Box>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={this.onMakeAbsoluteClick}
            >
              Make Absolute
            </Button>
          </Box>
        </Grid>
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
  public render()
  {
    return (
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={12}>
          <Typography variant="h6" component="span">Start:</Typography>
        </Grid>
        <EndPointDrawingProperties
          start={true}
          drawing={this.props.drawing}
          onDrawingChange={this.props.onChange as EndPointDrawingChangeEventHandler}
        />
        <Grid item={true} xs={12}>
          <Typography variant="h6" component="span">End:</Typography>
        </Grid>
        <EndPointDrawingProperties
          start={false}
          drawing={this.props.drawing}
          onDrawingChange={this.props.onChange as EndPointDrawingChangeEventHandler}
        />
        <Grid item={true} xs={12}>
          <ColorInput
            color={this.props.drawing.color}
            onChange={this.props.onColorChange}
          />
        </Grid>
        <LineStyleInputs
          dash={this.props.drawing.dash}
          strokeWidth={this.props.drawing.strokeWidth}
          onLineStyleChange={this.onLineStyleChange}
        />
      </Grid>
    );
  }

  private onLineStyleChange = ( lineStyle: Partial<LineStyle> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      ...lineStyle
    } );
  }
}

export class CurvedLineDrawingProperties extends DrawingPropertiesComponent<CurvedLineDrawing>
{
  public render()
  {
    return (
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={12}>
          <Typography variant="h6" component="span">Start:</Typography>
        </Grid>
        <EndPointDrawingProperties
          start={true}
          drawing={this.props.drawing}
          onDrawingChange={this.props.onChange as EndPointDrawingChangeEventHandler}
        />
        <Grid item={true} xs={12}>
          <Typography variant="h6" component="span">End:</Typography>
        </Grid>
        <EndPointDrawingProperties
          start={false}
          drawing={this.props.drawing}
          onDrawingChange={this.props.onChange as EndPointDrawingChangeEventHandler}
        />
        <Grid item={true} xs={12}>
          <ColorInput
            color={this.props.drawing.color}
            onChange={this.props.onColorChange}
          />
        </Grid>
        <LineStyleInputs
          dash={this.props.drawing.dash}
          strokeWidth={this.props.drawing.strokeWidth}
          onLineStyleChange={this.onLineStyleChange}
        />
      </Grid>
    );
  }

  private onLineStyleChange = ( lineStyle: Partial<LineStyle> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      ...lineStyle
    } );
  }
}

export class TextDrawingProperties extends DrawingPropertiesComponent<TextDrawing>
{
  public render()
  {
    return (
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={12}>
          <TextField
            label="Text"
            rows={4}
            fullWidth={true}
            variant="outlined"
            autoFocus={true}
            multiline={true}
            value={this.props.drawing.text}
            onChange={this.onTextChange}
          />
        </Grid>
        <XyInputs
          x={this.props.drawing.x}
          y={this.props.drawing.y}
          onXChange={this.onXChange}
          onYChange={this.onYChange}
        />
        <Grid item={true} xs={12}>
          <ColorInput
            color={this.props.drawing.color}
            onChange={this.props.onColorChange}
          />
        </Grid>
        <Grid item={true} xs={4}>
          <NumberInput
            label="Font Size"
            value={this.props.drawing.fontSize}
            onChange={this.onFontSizeChange}
          />
        </Grid>
        <Grid item={true} xs={4}>
          <TextField
            label="Horizontal Align"
            fullWidth={true}
            variant="outlined"
            select={true}
            value={this.props.drawing.horizontalAlign}
            onChange={this.onHorizontalAlignChange}
          >
            {Object.keys( HorizontalAlign ).map( ( horizontalAlign ) => (
              <MenuItem key={horizontalAlign} value={horizontalAlign}>{horizontalAlign}</MenuItem>
            ) )}
          </TextField>
        </Grid>
        <Grid item={true} xs={4}>
          <TextField
            label="Vertical Align"
            fullWidth={true}
            variant="outlined"
            select={true}
            value={this.props.drawing.verticalAlign}
            onChange={this.onVerticalAlignChange}
          >
            {Object.keys( VerticalAlign ).map( ( verticalAlign ) => (
              <MenuItem key={verticalAlign} value={verticalAlign}>{verticalAlign}</MenuItem>
            ) )}
          </TextField>
        </Grid>
      </Grid>
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

  private onHorizontalAlignChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      horizontalAlign: e.target.value as HorizontalAlign
    } );
  }

  private onVerticalAlignChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( {
      ...this.props.drawing,
      verticalAlign: e.target.value as VerticalAlign
    } );
  }
}
