import React from 'react';
import { connect } from 'react-redux';
import { Group, Circle, Shape } from 'react-konva';
import Konva from 'konva';
import { Context } from 'konva/types/Context';

import { DrawingComponentProps } from './DrawingComponent';
import { CurvedLineDrawing, DrawingMap, getEndPointPosition, dashStyles, LineDashStyle } from 'utils/draw';
import { currentDrawingsState } from 'store/selectors';

const OUTER_CIRCLE_RADIUS = 4;
const INNER_CIRCLE_RADIUS = 2;

interface PropsFromState
{
  drawings: DrawingMap;
}

type OwnProps = DrawingComponentProps<CurvedLineDrawing>;

type Props = PropsFromState & OwnProps;

const BEZIER_CURVE_CONTROL_POINT_X_OFFSET = 0.55;
const BEZIER_CURVE_CONTROL_POINT_Y_OFFSET = 0.15;

const BezierCurve: React.SFC<{
  color: string;
  strokeWidth: number;
  dash: LineDashStyle;
  start: { x: number, y: number };
  end: { x: number, y: number };
}> = ( { color, strokeWidth, dash, start: { x: startX, y: startY }, end: { x: endX, y: endY } } ) => (
  <Shape
    stroke={color}
    strokeWidth={strokeWidth}
    dash={dashStyles[ dash ]}
    sceneFunc={function( this: Konva.Shape, context: Context )
    {
      const width = endX - startX;
      const height = endY - startY;

      const cp1X = startX + width * BEZIER_CURVE_CONTROL_POINT_X_OFFSET;
      const cp1Y = startY + height * BEZIER_CURVE_CONTROL_POINT_Y_OFFSET;
      const cp2X = endX - width * BEZIER_CURVE_CONTROL_POINT_X_OFFSET;
      const cp2Y = endY - height * BEZIER_CURVE_CONTROL_POINT_Y_OFFSET;

      context.beginPath();
      context.moveTo( startX, startY );
      context.bezierCurveTo( cp1X, cp1Y, cp2X, cp2Y, endX, endY );

      context.strokeShape( this );
    }}
  />
);

const CurvedLine: React.SFC<Props> = ( { drawing, onMouseDown, onMouseUp, drawings, cursor = false } ) =>
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
    <Group onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      <BezierCurve
        color="transparent"
        strokeWidth={5}
        dash={drawing.dash}
        start={start}
        end={end}
      />
      <BezierCurve
        color={drawing.color}
        strokeWidth={drawing.strokeWidth}
        dash={drawing.dash}
        start={start}
        end={end}
      />
      {cursor && (
        <>
          {!isNaN( end.x ) && !isNaN( end.y ) && (
            <Circle
              x={end.x}
              y={end.y}
              radius={OUTER_CIRCLE_RADIUS}
              fill={drawing.color}
            />
          )}
          {!drawing.end.connected && (
            <Circle
              x={end.x}
              y={end.y}
              radius={INNER_CIRCLE_RADIUS}
              fill="white"
            />
          )}
          {!isNaN( start.x ) && !isNaN( start.y ) && (
            <Circle
              x={start.x}
              y={start.y}
              radius={OUTER_CIRCLE_RADIUS}
              fill={drawing.color}
            />
          )}
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
    drawings: currentDrawingsState( state ).drawings
  } ),
  {
  }
)( CurvedLine );
