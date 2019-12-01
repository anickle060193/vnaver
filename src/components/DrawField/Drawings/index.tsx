import React from 'react';
import { Path, Text as KText, Group, Rect } from 'react-konva';

import { DrawingComponentProps, LineDrawing } from './DrawingComponent';
import PathLine from './PathLine';
import CurvedLine from './CurvedLine';
import
{
  DrawingType,
  Drawing,
  BasicDrawing,
  BetweenDrawing,
  VerticalGridLineDrawing,
  HorizontalGridLineDrawing,
  UP_ARROW_PATH,
  DOWN_ARROW_PATH,
  DrawingMap,
  getEndPointPosition,
  PlaneDrawing,
  PLANE_PATH,
  DrawingTypeMap,
  LineStyle,
  TextDrawing,
  VerticalAlign,
  HorizontalAlign
} from 'utils/draw';
import { assertNever } from 'utils/utils';

const LINE_LENGTH = 10000;

const ARROW_SIZE = 30;
const ARROW_SCALE = ARROW_SIZE / 100;

interface BasicGuideLineProps extends LineStyle
{
  color: string;
}

interface VerticalGuideLineProps extends BasicGuideLineProps
{
  x: number;
  hitEnabled: boolean;
}

interface HorizontalGuideLineProps extends BasicGuideLineProps
{
  y: number;
  hitEnabled: boolean;
}

const VerticalGuideLine: React.SFC<VerticalGuideLineProps> = ( { x, color, dash, strokeWidth, hitEnabled } ) => (
  <LineDrawing
    x1={x}
    y1={-LINE_LENGTH}
    x2={x}
    y2={LINE_LENGTH}
    color={color}
    dash={dash}
    strokeWidth={strokeWidth}
    hitEnabled={hitEnabled}
  />
);

const HorizontalGuideLine: React.SFC<HorizontalGuideLineProps> = ( { y, color, strokeWidth, dash, hitEnabled } ) => (
  <LineDrawing
    x1={-LINE_LENGTH}
    y1={y}
    x2={LINE_LENGTH}
    y2={y}
    color={color}
    dash={dash}
    strokeWidth={strokeWidth}
    hitEnabled={hitEnabled}
  />
);

export const Above: React.SFC<DrawingComponentProps<BasicDrawing<DrawingType.Above>>> = ( { drawing, onMouseDown, onMouseUp } ) => (
  <Group onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
    <Path
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y - ARROW_SIZE / 2 + 5}
      scale={{ x: ARROW_SCALE, y: ARROW_SCALE }}
      fill={drawing.color}
      data={UP_ARROW_PATH}
    />
  </Group>
);

export const At: React.SFC<DrawingComponentProps<BasicDrawing<DrawingType.At>>> = ( { drawing, onMouseDown, onMouseUp } ) => (
  <Group onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
    <Path
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y - ARROW_SIZE * 3 / 4 + 2}
      scale={{ x: ARROW_SCALE, y: ARROW_SCALE }}
      fill={drawing.color}
      data={DOWN_ARROW_PATH}
    />
    <Path
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y - ARROW_SIZE / 4 - 2}
      scale={{ x: ARROW_SCALE, y: ARROW_SCALE }}
      fill={drawing.color}
      data={UP_ARROW_PATH}
    />
  </Group>
);

export const Below: React.SFC<DrawingComponentProps<BasicDrawing<DrawingType.Below>>> = ( { drawing, onMouseDown, onMouseUp } ) => (
  <Group onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
    <Path
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y - ARROW_SIZE + 9}
      scale={{ x: ARROW_SCALE, y: ARROW_SCALE }}
      fill={drawing.color}
      data={DOWN_ARROW_PATH}
    />
  </Group>
);

export const Between: React.SFC<DrawingComponentProps<BetweenDrawing>> = ( { drawing, onMouseDown, onMouseUp } ) => (
  <Group onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
    <Path
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y - ARROW_SIZE * 2 / 3}
      scale={{ x: ARROW_SCALE, y: ARROW_SCALE }}
      fill={drawing.color}
      data={DOWN_ARROW_PATH}
    />
    <Path
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y - ARROW_SIZE / 3 + drawing.height}
      scale={{ x: ARROW_SCALE, y: ARROW_SCALE }}
      fill={drawing.color}
      data={UP_ARROW_PATH}
    />
  </Group>
);

export const VerticalGridLine: React.SFC<DrawingComponentProps<VerticalGridLineDrawing>> = ( { drawing, onMouseDown, onMouseUp } ) => (
  <Group onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
    <VerticalGuideLine
      x={drawing.x}
      color={drawing.color}
      strokeWidth={drawing.strokeWidth}
      dash={drawing.dash}
      hitEnabled={true}
    />
  </Group>
);

export const HorizontalGridLine: React.SFC<DrawingComponentProps<HorizontalGridLineDrawing>> = ( { drawing, onMouseDown, onMouseUp } ) => (
  <Group onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
    <HorizontalGuideLine
      y={drawing.y}
      color={drawing.color}
      strokeWidth={drawing.strokeWidth}
      dash={drawing.dash}
      hitEnabled={true}
    />
  </Group>
);

const PLANE_PATH_SIZE = 100;

export const Plane: React.SFC<DrawingComponentProps<PlaneDrawing>> = ( { drawing, onMouseDown, onMouseUp } ) => (
  <Path
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    x={drawing.x}
    y={drawing.y}
    scale={{ x: drawing.size / PLANE_PATH_SIZE, y: drawing.size / PLANE_PATH_SIZE }}
    rotation={drawing.rotation}
    data={PLANE_PATH}
    fill={drawing.color}
  />
);

const horizontalAlignMap: { [ key in HorizontalAlign ]: string } = {
  [ HorizontalAlign.Left ]: 'left',
  [ HorizontalAlign.Center ]: 'center',
  [ HorizontalAlign.Right ]: 'right'
};

const calculateTextHeight = ( text: string, fontSize: number ) =>
{
  return text.split( '\n' ).length * fontSize;
};

const calculateTextY = ( text: string, fontSize: number, y: number, verticalAlign: VerticalAlign ) =>
{
  if( verticalAlign === VerticalAlign.Top )
  {
    return y;
  }
  else if( verticalAlign === VerticalAlign.Center )
  {
    return y - calculateTextHeight( text, fontSize ) / 2;
  }
  else if( verticalAlign === VerticalAlign.Bottom )
  {
    return y - calculateTextHeight( text, fontSize );
  }
  else
  {
    throw assertNever( verticalAlign );
  }
};

export const Text: React.SFC<DrawingComponentProps<TextDrawing>> = ( { drawing, onMouseDown, onMouseUp } ) => (
  <KText
    x={drawing.x}
    y={calculateTextY( drawing.text, drawing.fontSize, drawing.y, drawing.verticalAlign )}
    text={drawing.text}
    fontFamily="Roboto"
    fontSize={drawing.fontSize}
    fill={drawing.color}
    align={horizontalAlignMap[ drawing.horizontalAlign ]}
    wrap="none"
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
  />
);

type DrawingComponentType = React.ComponentType<DrawingComponentProps<Drawing>>;

export const drawingComponentMap: DrawingTypeMap<DrawingComponentType> = {
  [ DrawingType.Above ]: Above as DrawingComponentType,
  [ DrawingType.At ]: At as DrawingComponentType,
  [ DrawingType.Below ]: Below as DrawingComponentType,
  [ DrawingType.Between ]: Between as DrawingComponentType,
  [ DrawingType.PathLine ]: PathLine as DrawingComponentType,
  [ DrawingType.CurvedLine ]: CurvedLine as DrawingComponentType,
  [ DrawingType.VerticalGridLine ]: VerticalGridLine as DrawingComponentType,
  [ DrawingType.HorizontalGridLine ]: HorizontalGridLine as DrawingComponentType,
  [ DrawingType.Plane ]: Plane as DrawingComponentType,
  [ DrawingType.Text ]: Text as DrawingComponentType,
};

export const ActiveIndication: React.SFC<{
  drawings: DrawingMap;
  drawing: Drawing | null;
  originX: number;
  originY: number;
  scale: number;
  fieldWidth: number;
  fieldHeight: number;
}> = ( { drawings, drawing, originX, originY, scale, fieldWidth, fieldHeight } ) =>
  {
    if( !drawing )
    {
      return null;
    }

    let drawingFieldWidth = fieldWidth / scale;
    let drawingFieldHeight = fieldHeight / scale;

    let x: number;
    let y: number;
    let width: number;
    let height: number;

    if( drawing.type === DrawingType.Above )
    {
      x = drawing.x;
      y = drawing.y + ARROW_SIZE / 4;
      width = ARROW_SIZE;
      height = ARROW_SIZE;
    }
    else if( drawing.type === DrawingType.Below )
    {
      x = drawing.x;
      y = drawing.y - ARROW_SIZE / 4;
      width = ARROW_SIZE;
      height = ARROW_SIZE;
    }
    else if( drawing.type === DrawingType.At )
    {
      x = drawing.x;
      y = drawing.y;
      width = ARROW_SIZE;
      height = ARROW_SIZE;
    }
    else if( drawing.type === DrawingType.Between )
    {
      x = drawing.x;
      y = drawing.y + drawing.height / 2;
      width = ARROW_SIZE;
      height = ARROW_SIZE + drawing.height;
    }
    else if( drawing.type === DrawingType.PathLine
      || drawing.type === DrawingType.CurvedLine )
    {
      let start = getEndPointPosition( drawing.start, drawings );
      let end = getEndPointPosition( drawing.end, drawings );
      width = Math.abs( start.x - end.x );
      height = Math.abs( start.y - end.y );
      x = Math.min( start.x, end.x ) + width / 2;
      y = Math.min( start.y, end.y ) + height / 2;
    }
    else if( drawing.type === DrawingType.HorizontalGridLine )
    {
      x = drawingFieldWidth / 2 - originX / scale;
      y = drawing.y;
      width = drawingFieldWidth;
      height = drawing.strokeWidth;
    }
    else if( drawing.type === DrawingType.VerticalGridLine )
    {
      x = drawing.x;
      y = drawingFieldHeight / 2 - originY / scale;
      width = drawing.strokeWidth;
      height = drawingFieldHeight;
    }
    else if( drawing.type === DrawingType.Plane )
    {
      x = drawing.x;
      y = drawing.y;
      width = drawing.size;
      height = drawing.size;
    }
    else if( drawing.type === DrawingType.Text )
    {
      let lineCount = drawing.text.split( '\n' ).length;
      width = Math.max( ...drawing.text.split( '\n' ).map( ( line ) => line.length ) ) * drawing.fontSize * 0.5;
      height = lineCount * drawing.fontSize;
      if( drawing.verticalAlign === VerticalAlign.Top )
      {
        x = drawing.x;
        y = drawing.y + height / 2;
      }
      else if( drawing.verticalAlign === VerticalAlign.Center )
      {
        x = drawing.x;
        y = drawing.y;
      }
      else if( drawing.verticalAlign === VerticalAlign.Bottom )
      {
        x = drawing.x;
        y = drawing.y - height / 2;
      }
      else
      {
        throw assertNever( drawing.verticalAlign );
      }
      x += width / 2;
    }
    else
    {
      throw assertNever( drawing.type );
    }

    const ACTIVATION_PADDING = 8;
    const ACTIVATION_BORDER = 1;
    const ACTIVATION_CORNER_RADIUS = 4;

    let activationX = x - width / 2;
    let activationY = y - height / 2;

    return (
      <>
        <Rect
          x={activationX - ACTIVATION_PADDING / 2}
          y={activationY - ACTIVATION_PADDING / 2}
          width={width + ACTIVATION_PADDING}
          height={height + ACTIVATION_PADDING}
          cornerRadius={ACTIVATION_CORNER_RADIUS}
          fill="darkblue"
          opacity={0.8}
        />
        <Rect
          x={activationX - ACTIVATION_PADDING / 2 + ACTIVATION_BORDER}
          y={activationY - ACTIVATION_PADDING / 2 + ACTIVATION_BORDER}
          width={width + ACTIVATION_PADDING - 2 * ACTIVATION_BORDER}
          height={height + ACTIVATION_PADDING - 2 * ACTIVATION_BORDER}
          cornerRadius={ACTIVATION_CORNER_RADIUS}
          fill="rgb(173, 216, 230)"
          opacity={0.8}
        />
      </>
    );
  };
