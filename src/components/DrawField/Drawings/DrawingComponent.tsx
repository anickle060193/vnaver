import * as React from 'react';
import { Line } from 'react-konva';

import { Drawing, LineStyle, dashStyles } from 'utils/draw';

export interface DrawingComponentProps<D extends Drawing>
{
  drawing: D;
  cursor?: boolean;
  onClick?: ( e: KonvaMouseEvent<{}> ) => void;
  onMouseDown?: ( e: KonvaMouseEvent<{}> ) => void;
}

interface LineDrawingProps extends LineStyle
{
  color: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const LineDrawing: React.SFC<LineDrawingProps> = ( { x1, y1, x2, y2, color, strokeWidth, dash } ) => (
  <>
    <Line
      points={[ x1, y1, x2, y2 ]}
      stroke="transparent"
      strokeWidth={5}
    />
    <Line
      points={[ x1, y1, x2, y2 ]}
      stroke={color}
      strokeWidth={strokeWidth}
      dash={dashStyles[ dash ]}
    />
  </>
);
