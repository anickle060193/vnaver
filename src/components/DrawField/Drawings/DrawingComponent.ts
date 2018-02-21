import { Drawing } from 'utils/draw';

export interface DrawingComponentProps<D extends Drawing>
{
  drawing: D;
  cursor?: boolean;
  onClick?: ( e: KonvaMouseEvent<{}> ) => void;
}
