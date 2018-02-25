import * as React from 'react';
import { connect } from 'react-redux';
import { Group, Circle } from 'react-konva';

import { DrawingComponentProps, LineDrawing } from './DrawingComponent';
import { PathLineDrawing, DrawingMap, getEndPointPosition } from 'utils/draw';

const OUTER_CIRCLE_RADIUS = 4;
const INNER_CIRCLE_RADIUS = 2;

interface PropsFromState
{
  drawings: DrawingMap;
}

type OwnProps = DrawingComponentProps<PathLineDrawing>;

type Props = PropsFromState & OwnProps;

const PathLine: React.SFC<Props> = ( { drawing, onClick, onMouseDown, drawings, cursor = false } ) =>
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
    <Group onClick={onClick} onMouseDown={onMouseDown}>
      <LineDrawing
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        color={drawing.color}
        strokeWidth={drawing.strokeWidth}
        dash={drawing.dash}
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
    drawings: state.drawings.present.drawings
  } ),
  {
  }
)( PathLine );
