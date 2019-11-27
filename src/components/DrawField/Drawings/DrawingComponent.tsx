import React from 'react';
import { Line } from 'react-konva';
import Konva from 'konva';

import { Drawing, LineStyle, dashStyles } from 'utils/draw';

export interface DrawingComponentProps<D extends Drawing>
{
  drawing: D;
  cursor: boolean;
  onMouseDown?: ( e: Konva.KonvaEventObject<MouseEvent> ) => void;
  onMouseUp?: ( e: Konva.KonvaEventObject<MouseEvent> ) => void;
}

interface LineDrawingProps extends LineStyle
{
  color: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  hitEnabled: boolean;
}

export const LineDrawing: React.SFC<LineDrawingProps> = ( { x1, y1, x2, y2, color, strokeWidth, dash, hitEnabled } ) => (
  <>
    {hitEnabled && (
      <Line
        points={[ x1, y1, x2, y2 ]}
        stroke="transparent"
        strokeWidth={5}
        strokeHitEnabled={hitEnabled}
      />
    )}
    <Line
      points={[ x1, y1, x2, y2 ]}
      stroke={color}
      strokeWidth={strokeWidth}
      dash={dashStyles[ dash ]}
      strokeHitEnabled={hitEnabled}
    />
  </>
);
