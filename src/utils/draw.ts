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
  id: string;
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

export interface DrawingMap
{
  [ id: string ]: Drawing;
}

export const UP_ARROW_PATH = 'M97.969 73.984l-47.969-47.969L2.031 73.984H97.969z';
export const DOWN_ARROW_PATH = 'M2.031 26.016l47.969 47.969L97.969 26.016H2.031z';

export const drawingTypeColors: {[ key in DrawingType ]: string } = {
  [ DrawingType.Above ]: 'purple',
  [ DrawingType.At ]: 'green',
  [ DrawingType.Below ]: 'orange',
  [ DrawingType.Between ]: 'blue',
  [ DrawingType.VerticalGridLine ]: 'red',
  [ DrawingType.HorizontalGridLine ]: 'cyan',
};
