import * as React from 'react';
import { Path, Text as KText, Label, Tag, Group } from 'react-konva';

import { DrawingComponentProps, LineDrawing } from './DrawingComponent';
import PathLine from './PathLine';
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
}

interface HorizontalGuideLineProps extends BasicGuideLineProps
{
  y: number;
}

const VerticalGuideLine: React.SFC<VerticalGuideLineProps> = ( { x, color, dash, strokeWidth } ) => (
  <LineDrawing
    x1={x}
    y1={-LINE_LENGTH}
    x2={x}
    y2={LINE_LENGTH}
    color={color}
    dash={dash}
    strokeWidth={strokeWidth}
  />
);

const HorizontalGuideLine: React.SFC<HorizontalGuideLineProps> = ( { y, color, strokeWidth, dash } ) => (
  <LineDrawing
    x1={-LINE_LENGTH}
    y1={y}
    x2={LINE_LENGTH}
    y2={y}
    color={color}
    dash={dash}
    strokeWidth={strokeWidth}
  />
);

interface GuideLineProps extends VerticalGuideLineProps, HorizontalGuideLineProps
{
  vertical: boolean;
}

const GuideLine: React.SFC<GuideLineProps> = ( { x, y, vertical, color, dash, strokeWidth } ) => (
  vertical ?
    (
      <VerticalGuideLine x={x} color={color} strokeWidth={strokeWidth} dash={dash} />
    ) :
    (
      <HorizontalGuideLine y={y} color={color} strokeWidth={strokeWidth} dash={dash} />
    )
);

export const Above: React.SFC<DrawingComponentProps<BasicDrawing<DrawingType.Above>>> = ( { drawing, onClick, onMouseDown } ) => (
  <Group onClick={onClick} onMouseDown={onMouseDown}>
    {drawing.showGuideLine && (
      <GuideLine
        x={drawing.x}
        y={drawing.y}
        color={drawing.color}
        vertical={drawing.guideLine.vertical}
        strokeWidth={drawing.guideLine.strokeWidth}
        dash={drawing.guideLine.dash}
      />
    )}
    <Path
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y - ARROW_SIZE / 2 + 5}
      scale={{ x: ARROW_SCALE, y: ARROW_SCALE }}
      fill={drawing.color}
      data={UP_ARROW_PATH}
    />
  </Group>
);

export const At: React.SFC<DrawingComponentProps<BasicDrawing<DrawingType.At>>> = ( { drawing, onClick, onMouseDown } ) => (
  <Group onClick={onClick} onMouseDown={onMouseDown}>
    {drawing.showGuideLine && (
      <GuideLine
        x={drawing.x}
        y={drawing.y}
        color={drawing.color}
        vertical={drawing.guideLine.vertical}
        strokeWidth={drawing.guideLine.strokeWidth}
        dash={drawing.guideLine.dash}
      />
    )}
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

export const Below: React.SFC<DrawingComponentProps<BasicDrawing<DrawingType.Below>>> = ( { drawing, onClick, onMouseDown } ) => (
  <Group onClick={onClick} onMouseDown={onMouseDown}>
    {drawing.showGuideLine && (
      <GuideLine
        x={drawing.x}
        y={drawing.y}
        color={drawing.color}
        vertical={drawing.guideLine.vertical}
        strokeWidth={drawing.guideLine.strokeWidth}
        dash={drawing.guideLine.dash}
      />
    )}
    <Path
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y - ARROW_SIZE + 9}
      scale={{ x: ARROW_SCALE, y: ARROW_SCALE }}
      fill={drawing.color}
      data={DOWN_ARROW_PATH}
    />
  </Group>
);

export const Between: React.SFC<DrawingComponentProps<BetweenDrawing>> = ( { drawing, onClick, onMouseDown } ) => (
  <Group onClick={onClick} onMouseDown={onMouseDown}>
    {drawing.showGuideLine && (
      <GuideLine
        x={drawing.x}
        y={drawing.y}
        color={drawing.color}
        vertical={drawing.guideLine.vertical}
        strokeWidth={drawing.guideLine.strokeWidth}
        dash={drawing.guideLine.dash}
      />
    )}
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

export const VerticalGridLine: React.SFC<DrawingComponentProps<VerticalGridLineDrawing>> = ( { drawing, onClick, onMouseDown } ) => (
  <Group onClick={onClick} onMouseDown={onMouseDown}>
    <VerticalGuideLine
      x={drawing.x}
      color={drawing.color}
      strokeWidth={drawing.strokeWidth}
      dash={drawing.dash}
    />
  </Group>
);

export const HorizontalGridLine: React.SFC<DrawingComponentProps<HorizontalGridLineDrawing>> = ( { drawing, onClick, onMouseDown } ) => (
  <Group onClick={onClick} onMouseDown={onMouseDown}>
    <HorizontalGuideLine
      y={drawing.y}
      color={drawing.color}
      strokeWidth={drawing.strokeWidth}
      dash={drawing.dash}
    />
  </Group>
);

const PLANE_PATH_SIZE = 100;

export const Plane: React.SFC<DrawingComponentProps<PlaneDrawing>> = ( { drawing, onClick, onMouseDown } ) => (
  <Path
    onClick={onClick}
    onMouseDown={onMouseDown}
    x={drawing.x}
    y={drawing.y}
    scale={{ x: drawing.size / PLANE_PATH_SIZE, y: drawing.size / PLANE_PATH_SIZE }}
    rotation={drawing.rotation}
    data={PLANE_PATH}
    fill={drawing.color}
  />
);

const horizontalAlignMap: {[ key in HorizontalAlign ]: string } = {
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

export const Text: React.SFC<DrawingComponentProps<TextDrawing>> = ( { drawing, onClick, onMouseDown } ) => (
  <KText
    x={drawing.x}
    y={calculateTextY( drawing.text, drawing.fontSize, drawing.y, drawing.verticalAlign )}
    text={drawing.text}
    fontFamily="Roboto"
    fontSize={drawing.fontSize}
    fill={drawing.color}
    align={horizontalAlignMap[ drawing.horizontalAlign ]}
    wrap="none"
    onClick={onClick}
    onMouseDown={onMouseDown}
  />
);

export const drawingComponentMap: DrawingTypeMap<React.SFC<DrawingComponentProps<Drawing>> | React.ComponentClass<DrawingComponentProps<Drawing>>> = {
  [ DrawingType.Above ]: Above,
  [ DrawingType.At ]: At,
  [ DrawingType.Below ]: Below,
  [ DrawingType.Between ]: Between,
  [ DrawingType.PathLine ]: PathLine,
  [ DrawingType.VerticalGridLine ]: VerticalGridLine,
  [ DrawingType.HorizontalGridLine ]: HorizontalGridLine,
  [ DrawingType.Plane ]: Plane,
  [ DrawingType.Text ]: Text
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

    let x: number;
    let y: number;
    let arrowDirection = 'left';

    if( drawing.type === DrawingType.Above )
    {
      x = drawing.x + ARROW_SIZE / 2 + 3;
      y = drawing.y - 3;
    }
    else if( drawing.type === DrawingType.Below )
    {
      x = drawing.x + ARROW_SIZE / 2 + 3;
      y = drawing.y - 6;
    }
    else if( drawing.type === DrawingType.At )
    {
      x = drawing.x + ARROW_SIZE / 2 + 3;
      y = drawing.y - 7;
    }
    else if( drawing.type === DrawingType.Between )
    {
      x = drawing.x + ARROW_SIZE / 2 + 3;
      y = drawing.y - 12;
    }
    else if( drawing.type === DrawingType.PathLine )
    {
      let start = getEndPointPosition( drawing.start, drawings );
      if( !start )
      {
        return null;
      }
      let end = getEndPointPosition( drawing.end, drawings );
      if( !end )
      {
        return null;
      }

      arrowDirection = 'down';
      x = ( start.x + end.x ) / 2;
      y = ( start.y + end.y ) / 2;
    }
    else if( drawing.type === DrawingType.HorizontalGridLine )
    {
      arrowDirection = 'down';
      x = ( -originX + fieldWidth / 2 ) / scale;
      y = drawing.y - 4;
    }
    else if( drawing.type === DrawingType.VerticalGridLine )
    {
      x = drawing.x + 4;
      y = ( -originY + fieldHeight / 2 ) / scale;
    }
    else if( drawing.type === DrawingType.Plane )
    {
      x = drawing.x + drawing.size / 2 + 5;
      y = drawing.y;
    }
    else if( drawing.type === DrawingType.Text )
    {
      arrowDirection = 'right';
      x = drawing.x - 4;

      if( drawing.verticalAlign === VerticalAlign.Top )
      {
        y = drawing.y + calculateTextHeight( drawing.text, drawing.fontSize ) / 2;
      }
      else if( drawing.verticalAlign === VerticalAlign.Bottom )
      {
        y = drawing.y - calculateTextHeight( drawing.text, drawing.fontSize ) / 2;
      }
      else
      {
        y = drawing.y;
      }
    }
    else
    {
      throw assertNever( drawing.type );
    }

    return (
      <Label x={x} y={y}>
        <Tag
          fill="black"
          cornerRadius={4}
          pointerDirection={arrowDirection}
          pointerWidth={10}
          pointerHeight={10}
          lineJoin="round"
        />
        <KText
          text={drawing.id}
          fill="white"
          fontFamily="Roboto"
          fontSize={15}
          padding={4}
        />
      </Label>
    );
  };
