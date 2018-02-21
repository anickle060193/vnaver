import { DrawingTool, DrawingType, Tool } from 'utils/draw';

export const shortcuts: {[ key in DrawingTool ]: string } = {
  [ Tool.Cursor ]: 'Escape',
  [ Tool.Move ]: 'm',
  [ DrawingType.Above ]: 'u',
  [ DrawingType.At ]: 'a',
  [ DrawingType.Below ]: 'd',
  [ DrawingType.Between ]: 'b',
  [ DrawingType.PathLine ]: 'p',
  [ DrawingType.VerticalGridLine ]: 'v',
  [ DrawingType.HorizontalGridLine ]: 'h',
};
