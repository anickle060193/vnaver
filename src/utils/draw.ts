export const enum DrawingType
{
  Above = 'Above',
  At = 'At',
  Below = 'Below',
  Between = 'Between'
}

export const enum Tool
{
  Move = 'Move'
}

export type DrawingTool = DrawingType | Tool;

export interface DrawingBase<T extends DrawingType>
{
  type: T;
  x: number;
  y: number;
}

type BasicDrawingTypes = DrawingType.Above | DrawingType.At | DrawingType.Below;

export interface BasicDrawing<T extends BasicDrawingTypes> extends DrawingBase<T>
{
  type: T;
  x: number;
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
  BetweenDrawing
);
