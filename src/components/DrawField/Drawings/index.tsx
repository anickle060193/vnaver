import * as React from 'react';
import { Line, Rect, Path, Text, Label, Tag, Group } from 'react-konva';

import { DrawingComponentProps } from './DrawingComponent';
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
  DrawingTypeMap
} from 'utils/draw';
import { assertNever } from 'utils/utils';

const LINE_LENGTH = 10000;
const LINE_WIDTH = 5;

const GUIDE_LINE_WIDTH = 0.5;

const ARROW_SIZE = 30;
const ARROW_SCALE = ARROW_SIZE / 100;

interface BasicGuideLineProps
{
  color: string;
  strokeWidth: number;
}

interface VerticalGuideLineProps extends BasicGuideLineProps
{
  x: number;
}

interface HorizontalGuideLineProps extends BasicGuideLineProps
{
  y: number;
}

const VerticalGuideLine: React.SFC<VerticalGuideLineProps> = ( { x, color, strokeWidth } ) => (
  <>
    <Rect
      x={x - LINE_WIDTH / 2}
      width={LINE_WIDTH}
      y={-LINE_LENGTH}
      height={2 * LINE_LENGTH}
    />
    <Line
      points={[ x, -LINE_LENGTH, x, LINE_LENGTH ]}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </>
);

const HorizontalGuideLine: React.SFC<HorizontalGuideLineProps> = ( { y, color, strokeWidth } ) => (
  <>
    <Rect
      x={-LINE_LENGTH}
      width={2 * LINE_LENGTH}
      y={y - LINE_WIDTH / 2}
      height={LINE_WIDTH}
    />
    <Line
      points={[ -LINE_LENGTH, y, LINE_LENGTH, y ]}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </>
);

interface GuideLineProps extends VerticalGuideLineProps, HorizontalGuideLineProps
{
  vertical: boolean;
}

const GuideLine: React.SFC<GuideLineProps> = ( { x, y, vertical, color, strokeWidth } ) => (
  vertical ? (
    <VerticalGuideLine x={x} color={color} strokeWidth={strokeWidth} />
  ) : (
      <HorizontalGuideLine y={y} color={color} strokeWidth={strokeWidth} />
    )
);

export const Above: React.SFC<DrawingComponentProps<BasicDrawing<DrawingType.Above>>> = ( { drawing, onClick, onMouseDown } ) => (
  <Group onClick={onClick} onMouseDown={onMouseDown}>
    {drawing.showGuideLine && (
      <GuideLine
        x={drawing.x}
        y={drawing.y}
        vertical={drawing.guideLine.vertical}
        color={drawing.color}
        strokeWidth={GUIDE_LINE_WIDTH}
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
        vertical={drawing.guideLine.vertical}
        color={drawing.color}
        strokeWidth={GUIDE_LINE_WIDTH}
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
        vertical={drawing.guideLine.vertical}
        color={drawing.color}
        strokeWidth={GUIDE_LINE_WIDTH}
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
        vertical={drawing.guideLine.vertical}
        color={drawing.color}
        strokeWidth={GUIDE_LINE_WIDTH}
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
    <VerticalGuideLine x={drawing.x} color={drawing.color} strokeWidth={1} />
  </Group>
);

export const HorizontalGridLine: React.SFC<DrawingComponentProps<HorizontalGridLineDrawing>> = ( { drawing, onClick, onMouseDown } ) => (
  <Group onClick={onClick} onMouseDown={onMouseDown}>
    <HorizontalGuideLine y={drawing.y} color={drawing.color} strokeWidth={1} />
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

export const drawingComponentMap: DrawingTypeMap<React.SFC<DrawingComponentProps<Drawing>> | React.ComponentClass<DrawingComponentProps<Drawing>>> = {
  [ DrawingType.Above ]: Above,
  [ DrawingType.At ]: At,
  [ DrawingType.Below ]: Below,
  [ DrawingType.Between ]: Between,
  [ DrawingType.PathLine ]: PathLine,
  [ DrawingType.VerticalGridLine ]: VerticalGridLine,
  [ DrawingType.HorizontalGridLine ]: HorizontalGridLine,
  [ DrawingType.Plane ]: Plane
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
        <Text
          text={drawing.id}
          fill="white"
          fontFamily="Roboto"
          fontSize={15}
          padding={4}
        />
      </Label>
    );
  };
