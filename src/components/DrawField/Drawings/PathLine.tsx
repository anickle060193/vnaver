import * as React from 'react';
import { connect } from 'react-redux';
import { Line, Group, Circle } from 'react-konva';

import { DrawingComponentProps } from './DrawingComponent';
import { PathLineDrawing, DrawingMap, getEndPointPosition } from 'utils/draw';

interface PropsFromState
{
  drawings: DrawingMap;
}

type OwnProps = DrawingComponentProps<PathLineDrawing>;

type Props = PropsFromState & OwnProps;

const PathLine: React.SFC<Props> = ( { drawing, onClick, drawings } ) =>
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
        strokeWidth={1}
      />
      <Circle
        x={end.x}
        y={end.y}
        radius={3}
        fill={drawing.color}
      />
      <Circle
        x={start.x}
        y={start.y}
        radius={3}
        fill={drawing.color}
      />
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
