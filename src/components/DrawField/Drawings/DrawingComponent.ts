import { Drawing } from 'utils/draw';

export interface DrawingComponentProps<D extends Drawing>
{
  drawing: D;
  onClick?: ( e: KonvaMouseEvent<{}> ) => void;
}
