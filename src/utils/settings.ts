import { DrawingTool, DrawingType, Tool } from 'utils/draw';

export const shortcuts: {[ key in DrawingTool ]: string } = {
  [ Tool.Move ]: 'm',
  [ DrawingType.Above ]: 'u',
  [ DrawingType.At ]: 'a',
  [ DrawingType.Below ]: 'd',
  [ DrawingType.Between ]: 'b',
  [ DrawingType.VerticalGridLine ]: 'v',
  [ DrawingType.HorizontalGridLine ]: 'h',
};
