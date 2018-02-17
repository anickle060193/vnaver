export const enum Tool
{
  Above = 'Above',
  At = 'At',
  Below = 'Below',
  Between = 'Between'
}

export interface DrawingBase<T extends Tool>
{
  type: T;
  x: number;
  y: number;
}

type BasicTools = Tool.Above | Tool.At | Tool.Below;

export interface BasicDrawing<T extends BasicTools> extends DrawingBase<T>
{
  type: T;
  x: number;
  y: number;
}

export interface BetweenDrawing extends DrawingBase<Tool.Between>
{
  type: Tool.Between;
  x: number;
  y: number;
  height: number;
}

export type Drawing = (
  BasicDrawing<BasicTools> |
  BetweenDrawing
);
