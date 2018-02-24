import { assertNever } from 'utils/utils';

export const enum DrawingType
{
  Above = 'Above',
  At = 'At',
  Below = 'Below',
  Between = 'Between',
  PathLine = 'PathLine',
  VerticalGridLine = 'VerticalGridLine',
  HorizontalGridLine = 'HorizontalGridLine'
}

export const enum Tool
{
  Cursor = 'Cursor'
}

export type DrawingTool = DrawingType | Tool;

export interface DrawingBase<T extends DrawingType>
{
  type: T;
  id: string;
  color: string;
}

interface ContainsGuideLineDrawing<T extends DrawingType> extends DrawingBase<T>
{
  showGuideLine: boolean;
  guideLine: {
    vertical: boolean;
  };
}

export type BasicDrawingTypes = DrawingType.Above | DrawingType.At | DrawingType.Below;

export interface BasicDrawing<T extends BasicDrawingTypes> extends ContainsGuideLineDrawing<T>
{
  type: T;
  x: number;
  y: number;
}

export interface BetweenDrawing extends ContainsGuideLineDrawing<DrawingType.Between>
{
  type: DrawingType.Between;
  x: number;
  y: number;
  height: number;
}

interface ConnectedPathLineEndPoint
{
  connected: true;
  anchorId: string;
  topOfBetween: boolean;
}

interface FloatingPathLineEndPoint
{
  connected: false;
  x: number;
  y: number;
}

type EndPoint = ConnectedPathLineEndPoint | FloatingPathLineEndPoint;

export interface PathLineDrawing extends DrawingBase<DrawingType.PathLine>
{
  type: DrawingType.PathLine;
  start: EndPoint;
  end: EndPoint;
}

export interface VerticalGridLineDrawing extends DrawingBase<DrawingType.VerticalGridLine>
{
  type: DrawingType.VerticalGridLine;
  x: number;
}

export interface HorizontalGridLineDrawing extends DrawingBase<DrawingType.HorizontalGridLine>
{
  type: DrawingType.HorizontalGridLine;
  y: number;
}

export type Drawing = (
  BasicDrawing<BasicDrawingTypes> |
  BetweenDrawing |
  PathLineDrawing |
  VerticalGridLineDrawing |
  HorizontalGridLineDrawing
);

export type AnchorDrawing = (
  BasicDrawing<BasicDrawingTypes> |
  BetweenDrawing
);

export interface DrawingMap
{
  [ id: string ]: Drawing;
}

export const drawingTypeColors: {[ key in DrawingType ]: string } = {
  [ DrawingType.Above ]: '#800080',
  [ DrawingType.At ]: '#008000',
  [ DrawingType.Below ]: '#ffa500',
  [ DrawingType.Between ]: '#0000ff',
  [ DrawingType.PathLine ]: '#ff0000',
  [ DrawingType.VerticalGridLine ]: '#ff0000',
  [ DrawingType.HorizontalGridLine ]: '#00ffff',
};

export const UP_ARROW_PATH = 'M97.969 73.984l-47.969-47.969L2.031 73.984H97.969z';
export const DOWN_ARROW_PATH = 'M2.031 26.016l47.969 47.969L97.969 26.016H2.031z';

const SCALE_LEVELS = [ 0.25, 1 / 3, 0.5, 2 / 3, 0.75, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0, 4.0, 5.0 ];
export const MIN_SCALE_LEVEL = 0;
export const MAX_SCALE_LEVEL = SCALE_LEVELS.length - 1;
export const DEFAULT_SCALE_LEVEL = SCALE_LEVELS.indexOf( 1.0 );

export function getScale( scaleLevel: number )
{
  return SCALE_LEVELS[ scaleLevel ] || 1.0;
}

export function isValidAnchor( drawing: Drawing | null ): drawing is AnchorDrawing
{
  return (
    !!drawing
    && ( drawing.type === DrawingType.At
      || drawing.type === DrawingType.Above
      || drawing.type === DrawingType.Below
      || drawing.type === DrawingType.Between )
  );
}

export const getEndPointPosition = ( endPoint: EndPoint, drawings: DrawingMap ) =>
{
  if( !endPoint.connected )
  {
    return {
      x: endPoint.x,
      y: endPoint.y
    };
  }
  else
  {
    let anchor = drawings[ endPoint.anchorId ];

    if( !isValidAnchor( anchor ) )
    {
      console.error( 'Invalid anchor - ID:', endPoint.anchorId, anchor );
      return null;
    }
    else if( anchor.type === DrawingType.Above
      || anchor.type === DrawingType.At
      || anchor.type === DrawingType.Below )
    {
      return {
        x: anchor.x,
        y: anchor.y
      };
    }
    else if( anchor.type === DrawingType.Between )
    {
      if( endPoint.topOfBetween )
      {
        return {
          x: anchor.x,
          y: anchor.y
        };
      }
      else
      {
        return {
          x: anchor.x,
          y: anchor.y + anchor.height
        };
      }
    }
    else
    {
      throw assertNever( anchor.type );
    }
  }
};

interface BaseDraggingInfo<T extends DrawingType>
{
  drawingType: T;
  drawingId: string;
  deltaX: number;
  deltaY: number;
}

export type DraggingInfo = BaseDraggingInfo<DrawingType>;
