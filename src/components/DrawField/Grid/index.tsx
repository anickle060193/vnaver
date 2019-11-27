import React from 'react';
import { Line } from 'react-konva';

import { floorToNearest, ceilingToNearest } from 'utils/utils';

interface Props
{
  width: number;
  height: number;
  originX: number;
  originY: number;
  scale: number;
  verticalInterval: number;
  horizontalInterval: number;
}

const GRID_STROKE = 'darkgray';
const GRID_STROKE_WIDTH = 0.8;

const Grid: React.SFC<Props> = ( { width, height, originX, originY, scale, verticalInterval, horizontalInterval } ) =>
{
  let grid: React.ReactNode[] = [];

  let drawingWidth = width / scale;
  let drawingHeight = height / scale;

  let drawingOriginX = -originX / scale;
  let drawingOriginY = -originY / scale;

  let drawingLeft = floorToNearest( drawingOriginX, verticalInterval );
  let drawingRight = ceilingToNearest( drawingLeft + drawingWidth + verticalInterval, verticalInterval );
  let drawingTop = floorToNearest( drawingOriginY, horizontalInterval );
  let drawingBottom = ceilingToNearest( drawingTop + drawingHeight + horizontalInterval, horizontalInterval );

  let strokeWidth = GRID_STROKE_WIDTH / scale;

  let i = 0;
  for( let x = drawingLeft; x <= drawingRight; x += verticalInterval )
  {
    grid.push(
      <Line
        key={'vertical_' + i}
        points={[ x, drawingTop, x, drawingBottom ]}
        stroke={GRID_STROKE}
        strokeWidth={strokeWidth}
        strokeHitEnabled={false}
      />
    );
    i += 1;
  }

  i = 0;
  for( let y = drawingTop; y <= drawingBottom; y += horizontalInterval )
  {
    grid.push(
      <Line
        key={'horizontal_' + i}
        points={[ drawingLeft, y, drawingRight, y ]}
        stroke={GRID_STROKE}
        strokeWidth={GRID_STROKE_WIDTH}
        strokeHitEnabled={false}
      />
    );
    i += 1;
  }

  return (
    <>
      {grid}
    </>
  );
};

export default Grid;
