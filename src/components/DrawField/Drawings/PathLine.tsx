import * as React from 'react';
import { connect } from 'react-redux';
import { Line, Group, Circle } from 'react-konva';

import { DrawingComponentProps } from './DrawingComponent';
import { PathLineDrawing, DrawingMap, getEndPointPosition } from 'utils/draw';

const OUTER_CIRCLE_RADIUS = 4;
const INNER_CIRCLE_RADIUS = 2;

interface PropsFromState
{
  drawings: DrawingMap;
}

type OwnProps = DrawingComponentProps<PathLineDrawing>;

type Props = PropsFromState & OwnProps;

const PathLine: React.SFC<Props> = ( { drawing, onClick, drawings, cursor = false } ) =>
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

  return (
    <Group onClick={onClick}>
      <Line
        points={[ start.x, start.y, end.x, end.y ]}
        strokeWidth={5}
        opacity={0.0}
        stroke="black"
      />
      <Line
        points={[ start.x, start.y, end.x, end.y ]}
        stroke={drawing.color}
        strokeWidth={2}
      />
      {cursor && (
        <>
          {!isNaN( end.x ) && !isNaN( end.y ) && (
            <Circle
              x={end.x}
              y={end.y}
              radius={OUTER_CIRCLE_RADIUS}
              fill={drawing.color}
            /> )}
          {!drawing.end.connected && (
            <Circle
              x={end.x}
              y={end.y}
              radius={INNER_CIRCLE_RADIUS}
              fill="white"
            />
          )}
          {!isNaN( start.x ) && !isNaN( start.y ) &&
            <Circle
              x={start.x}
              y={start.y}
              radius={OUTER_CIRCLE_RADIUS}
              fill={drawing.color}
            />}
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
    </Group>
  );
};

export default connect<PropsFromState, {}, OwnProps, RootState>(
  ( state ) => ( {
    drawings: state.drawing.drawings
  } ),
  {
  }
)( PathLine );
