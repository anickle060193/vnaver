import * as React from 'react';
import { Line, Rect, Path, Text, Label, Tag } from 'react-konva';

import
{
  DrawingType,
  Drawing,
  BasicDrawing,
  BetweenDrawing,
  VerticalGridLineDrawing,
  HorizontalGridLineDrawing,
  drawingTypeColors,
  UP_ARROW_PATH,
  DOWN_ARROW_PATH
} from 'utils/draw';
import { assertNever } from 'utils/utils';

interface DrawingComponentProps<D extends Drawing>
{
  drawing: D;
  onClick?: ( e: KonvaMouseEvent<{}> ) => void;
}

const ARROW_SIZE = 30;
const ARROW_SCALE = ARROW_SIZE / 100;

export const Above: React.SFC<DrawingComponentProps<BasicDrawing<DrawingType.Above>>> = ( { drawing, onClick } ) => (
  <Path
    x={drawing.x - ARROW_SIZE / 2}
    y={drawing.y - ARROW_SIZE / 2}
    width={ARROW_SIZE}
    height={ARROW_SIZE}
    scale={{ x: ARROW_SCALE, y: ARROW_SCALE }}
    fill={drawingTypeColors[ drawing.type ]}
    data={UP_ARROW_PATH}
    onClick={onClick}
  />
);

export const At: React.SFC<DrawingComponentProps<BasicDrawing<DrawingType.At>>> = ( { drawing, onClick } ) => (
  <>
    <Path
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y - ARROW_SIZE + 3}
      width={ARROW_SIZE}
      height={ARROW_SIZE}
      scale={{ x: ARROW_SCALE, y: ARROW_SCALE }}
      fill={drawingTypeColors[ drawing.type ]}
      data={DOWN_ARROW_PATH}
      onClick={onClick}
    />
    <Path
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y - 16}
      width={ARROW_SIZE}
      height={ARROW_SIZE}
      scale={{ x: ARROW_SCALE, y: ARROW_SCALE }}
      fill={drawingTypeColors[ drawing.type ]}
      data={UP_ARROW_PATH}
      onClick={onClick}
    />
  </>
);

export const Below: React.SFC<DrawingComponentProps<BasicDrawing<DrawingType.Below>>> = ( { drawing, onClick } ) => (
  <Path
    x={drawing.x - ARROW_SIZE / 2}
    y={drawing.y - ARROW_SIZE + 8}
    width={ARROW_SIZE}
    height={ARROW_SIZE}
    scale={{ x: ARROW_SCALE, y: ARROW_SCALE }}
    fill={drawingTypeColors[ drawing.type ]}
    data={DOWN_ARROW_PATH}
    onClick={onClick}
  />
);

export const Between: React.SFC<DrawingComponentProps<BetweenDrawing>> = ( { drawing, onClick } ) => (
  <>
    <Path
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y - ARROW_SIZE}
      width={ARROW_SIZE}
      height={ARROW_SIZE}
      scale={{ x: ARROW_SCALE, y: ARROW_SCALE }}
      fill={drawingTypeColors[ drawing.type ]}
      data={DOWN_ARROW_PATH}
      onClick={onClick}
    />
    <Path
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y + drawing.height}
      width={ARROW_SIZE}
      height={ARROW_SIZE}
      scale={{ x: ARROW_SCALE, y: ARROW_SCALE }}
      fill={drawingTypeColors[ drawing.type ]}
      data={UP_ARROW_PATH}
      onClick={onClick}
    />
  </>
);

const LINE_LENGTH = 10000;
const LINE_WIDTH = 5;

export const VerticalGridLine: React.SFC<DrawingComponentProps<VerticalGridLineDrawing>> = ( { drawing, onClick } ) => (
  <>
    <Rect
      x={drawing.x - LINE_WIDTH / 2}
      width={LINE_WIDTH}
      y={-LINE_LENGTH}
      height={2 * LINE_LENGTH}
      onClick={onClick}
    />
    <Line
      points={[ drawing.x, -LINE_LENGTH, drawing.x, LINE_LENGTH ]}
      stroke={drawingTypeColors[ drawing.type ]}
      strokeWidth={1}
      onClick={onClick}
    />
  </>
);

export const HorizontalGridLine: React.SFC<DrawingComponentProps<HorizontalGridLineDrawing>> = ( { drawing, onClick } ) => (
  <>
    <Rect
      x={-LINE_LENGTH}
      width={2 * LINE_LENGTH}
      y={drawing.y - LINE_WIDTH / 2}
      height={LINE_WIDTH}
      onClick={onClick}
    />
    <Line
      points={[ -LINE_LENGTH, drawing.y, LINE_LENGTH, drawing.y ]}
      stroke={drawingTypeColors[ drawing.type ]}
      strokeWidth={1}
      onClick={onClick}
      strokeHitEnabled={true}
    />
  </>
);

export const drawingComponentMap: {[ key in DrawingType ]: React.SFC<DrawingComponentProps<Drawing>> } = {
  [ DrawingType.Above ]: Above,
  [ DrawingType.At ]: At,
  [ DrawingType.Below ]: Below,
  [ DrawingType.Between ]: Between,
  [ DrawingType.VerticalGridLine ]: VerticalGridLine,
  [ DrawingType.HorizontalGridLine ]: HorizontalGridLine,
};

export const ActiveIndication: React.SFC<{
  drawing: Drawing | null;
  originX: number;
  originY: number;
  scale: number;
  fieldWidth: number;
  fieldHeight: number;
}> = ( { drawing, originX, originY, scale, fieldWidth, fieldHeight } ) =>
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
