import React from 'react';
import { connect } from 'react-redux';
import { Group, Circle } from 'react-konva';

import { DrawingComponentProps, LineDrawing } from './DrawingComponent';
import { PathLineDrawing, DrawingMap, getEndPointPosition } from 'utils/draw';
import { currentDrawingsState } from 'store/selectors';

const OUTER_CIRCLE_RADIUS = 4;
const INNER_CIRCLE_RADIUS = 2;

interface PropsFromState
{
  drawings: DrawingMap;
}

type OwnProps = DrawingComponentProps<PathLineDrawing>;

type Props = PropsFromState & OwnProps;

const PathLine: React.SFC<Props> = ( { drawing, onMouseDown, onMouseUp, drawings, cursor = false } ) =>
{
  let start = getEndPointPosition( drawing.start, drawings );
  if( !start )
  {
    return null;
  }
  let end = getEndPointPosition( drawing.end, drawings );
  if( !end )
  {
    return null;
  }

  const hasStart = !isNaN( start.x ) && !isNaN( start.y );
  const hasEnd = !isNaN( end.x ) && !isNaN( end.y );

  return (
    <Group onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      {hasStart && hasEnd && (
        <LineDrawing
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          color={drawing.color}
          strokeWidth={drawing.strokeWidth}
          dash={drawing.dash}
          hitEnabled={true}
        />
      )}
      {cursor && (
        <>
          {hasEnd && (
            <>
              <Circle
                x={end.x}
                y={end.y}
                radius={OUTER_CIRCLE_RADIUS}
                fill={drawing.color}
              />
              {!drawing.end.connected && (
                <Circle
                  x={end.x}
                  y={end.y}
                  radius={INNER_CIRCLE_RADIUS}
                  fill="white"
                />
              )}
            </>
          )}
          {hasStart && (
            <>
              <Circle
                x={start.x}
                y={start.y}
                radius={OUTER_CIRCLE_RADIUS}
                fill={drawing.color}
              />
              {!drawing.start.connected && (
                <Circle
                  x={start.x}
                  y={start.y}
                  radius={INNER_CIRCLE_RADIUS}
                  fill="white"
                />
              )}
            </>
          )}
        </>
      )}
    </Group>
  );
};

export default connect<PropsFromState, {}, OwnProps, RootState>(
  ( state ) => ( {
    drawings: currentDrawingsState( state ).drawings
  } ),
  {
  }
)( PathLine );
