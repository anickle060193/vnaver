export const enum DrawingType
{
  Above = 'Above',
  At = 'At',
  Below = 'Below',
  Between = 'Between',
  VerticalGridLine = 'VerticalGridLine',
  HorizontalGridLine = 'HorizontalGridLine'
}

export const enum Tool
{
  Move = 'Move'
}

export type DrawingTool = DrawingType | Tool;

export interface DrawingBase<T extends DrawingType>
{
  type: T;
}

type BasicDrawingTypes = DrawingType.Above | DrawingType.At | DrawingType.Below;

export interface BasicDrawing<T extends BasicDrawingTypes> extends DrawingBase<T>
{
  type: T;
  x: number;
  y: number;
}

export interface VerticalGridLineDrawing extends DrawingBase<DrawingType.VerticalGridLine>
{
  type: DrawingType.VerticalGridLine;
  x: number;
}

export interface HorizontalGridLineDrawing extends DrawingBase<DrawingType.HorizontalGridLine>
{
  type: DrawingType.HorizontalGridLine;
  y: number;
}

export interface BetweenDrawing extends DrawingBase<DrawingType.Between>
{
  type: DrawingType.Between;
  x: number;
  y: number;
  height: number;
}

export type Drawing = (
  BasicDrawing<BasicDrawingTypes> |
  BetweenDrawing |
  VerticalGridLineDrawing |
  HorizontalGridLineDrawing
);

export const UP_ARROW_PATH = 'M97.969 73.984l-47.969-47.969L2.031 73.984H97.969z';
export const DOWN_ARROW_PATH = 'M2.031 26.016l47.969 47.969L97.969 26.016H2.031z';
export const MOVE_PATH = `M21.915 71.415.5 49.999l21.414-21.415.001 16.49h23.16V21.915l-16.49
                          0L50.001.5l21.414 21.415-16.49 0v23.16h23.16l-.001-16.49L99.5
                          50.001l-21.415 21.414-.001-16.49h-23.16v23.16l16.49 0L49.999
                          99.5l-21.415-21.415 16.49 0V54.925H21.915L21.915 71.415z`;

export const drawingTypeColors: {[ key in DrawingType ]: string } = {
  [ DrawingType.Above ]: 'purple',
  [ DrawingType.At ]: 'green',
  [ DrawingType.Below ]: 'orange',
  [ DrawingType.Between ]: 'blue',
  [ DrawingType.VerticalGridLine ]: 'red',
  [ DrawingType.HorizontalGridLine ]: 'cyan',
};
