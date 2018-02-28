import { assertNever } from 'utils/utils';

export const enum DrawingType
{
  Above = 'Above',
  At = 'At',
  Below = 'Below',
  Between = 'Between',
  PathLine = 'PathLine',
  VerticalGridLine = 'VerticalGridLine',
  HorizontalGridLine = 'HorizontalGridLine',
  Plane = 'Plane',
  Text = 'Text'
}

export const enum Tool
{
  Cursor = 'Cursor'
}

export type DrawingTool = DrawingType | Tool;

export const drawingToolDisplayNames: {[ key in DrawingTool ]: string } = {
  [ Tool.Cursor ]: 'Cursor',
  [ DrawingType.Above ]: 'Above Constraint',
  [ DrawingType.At ]: 'At Constraint',
  [ DrawingType.Below ]: 'Below Constraint',
  [ DrawingType.Between ]: 'Between Constraint',
  [ DrawingType.PathLine ]: 'Path Line',
  [ DrawingType.VerticalGridLine ]: 'Vertical Grid Line',
  [ DrawingType.HorizontalGridLine ]: 'Horizontal Grid Line',
  [ DrawingType.Plane ]: 'Plane',
  [ DrawingType.Text ]: 'Text'
};

export interface DrawingBase<T extends DrawingType>
{
  type: T;
  id: string;
  color: string;
}

export const enum LineDashStyle
{
  Solid = 'Solid',
  Dotted = 'Dotted',
  DenselyDotted = 'DenselyDotted',
  LooselyDotted = 'LooselyDotted',
  Dashed = 'Dashed',
  DenselyDashed = 'DenselyDashed',
  LooselyDashed = 'LooselyDashed',
  DashDotted = 'DashDotted',
  DenselyDashDotted = 'DenselyDashDotted',
  LooselyDashDotted = 'LooselyDashDotted'
}

const DOT_LENGTH = 4;
const DASH_LENGTH = 10;

const DENSE = 6;
const NORMAL = 10;
const LOOSE = 20;

export const dashStyles: {[ key in LineDashStyle ]: number[]} = {
  [ LineDashStyle.Solid ]: [],

  [ LineDashStyle.DenselyDotted ]: [ DOT_LENGTH, DENSE ],
  [ LineDashStyle.Dotted ]: [ DOT_LENGTH, NORMAL ],
  [ LineDashStyle.LooselyDotted ]: [ DOT_LENGTH, LOOSE ],

  [ LineDashStyle.DenselyDashed ]: [ DASH_LENGTH, DENSE ],
  [ LineDashStyle.Dashed ]: [ DASH_LENGTH, NORMAL ],
  [ LineDashStyle.LooselyDashed ]: [ DASH_LENGTH, LOOSE ],

  [ LineDashStyle.DenselyDashDotted ]: [ DOT_LENGTH, DENSE, DASH_LENGTH, DENSE ],
  [ LineDashStyle.DashDotted ]: [ DOT_LENGTH, NORMAL, DASH_LENGTH, NORMAL ],
  [ LineDashStyle.LooselyDashDotted ]: [ DOT_LENGTH, LOOSE, DASH_LENGTH, LOOSE ]
};

export interface LineStyle
{
  dash: LineDashStyle;
  strokeWidth: number;
}

interface ContainsGuideLineDrawing<T extends DrawingType> extends DrawingBase<T>
{
  showGuideLine: boolean;
  guideLine: LineStyle & {
    vertical: boolean;
  };
}

export type BasicDrawingTypes = DrawingType.Above | DrawingType.At | DrawingType.Below;

export interface BasicDrawing<T extends BasicDrawingTypes> extends ContainsGuideLineDrawing<T>
{
  x: number;
  y: number;
}

export interface BetweenDrawing extends ContainsGuideLineDrawing<DrawingType.Between>
{
  x: number;
  y: number;
  height: number;
}

interface ConnectedPathLineEndPoint
{
  connected: true;
  anchorId: string;
  topOfBetween: boolean;
  startOfPathLine: boolean;
}

interface FloatingPathLineEndPoint
{
  connected: false;
  x: number;
  y: number;
}

export type EndPoint = ConnectedPathLineEndPoint | FloatingPathLineEndPoint;

export interface PathLineDrawing extends DrawingBase<DrawingType.PathLine>, LineStyle
{
  start: EndPoint;
  end: EndPoint;
}

export interface VerticalGridLineDrawing extends DrawingBase<DrawingType.VerticalGridLine>, LineStyle
{
  x: number;
}

export interface HorizontalGridLineDrawing extends DrawingBase<DrawingType.HorizontalGridLine>, LineStyle
{
  y: number;
}

export interface PlaneDrawing extends DrawingBase<DrawingType.Plane>
{
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export enum HorizontalAlign
{
  Left = 'Left',
  Center = 'Center',
  Right = 'Right'
}

export enum VerticalAlign
{
  Top = 'Top',
  Center = 'Center',
  Bottom = 'Bottom'
}

export interface TextDrawing extends DrawingBase<DrawingType.Text>
{
  x: number;
  y: number;
  horizontalAlign: HorizontalAlign;
  verticalAlign: VerticalAlign;
  text: string;
  fontSize: number;
}

export type Drawing = (
  BasicDrawing<BasicDrawingTypes> |
  BetweenDrawing |
  PathLineDrawing |
  VerticalGridLineDrawing |
  HorizontalGridLineDrawing |
  PlaneDrawing |
  TextDrawing
);

export type AnchorDrawing = (
  BasicDrawing<BasicDrawingTypes> |
  BetweenDrawing |
  PathLineDrawing
);

export interface DrawingMap
{
  [ id: string ]: Drawing;
}

export type DrawingTypeMap<T> = {[ key in DrawingType ]: T };

export const UP_ARROW_PATH = 'M97.969 73.984l-47.969-47.969L2.031 73.984H97.969z';
export const DOWN_ARROW_PATH = 'M2.031 26.016l47.969 47.969L97.969 26.016H2.031z';
export const PLANE_PATH = `m-20.64 45.98 9.68 0 24.2-38.72 26.62 0c4.017 0 7.26-3.243 7.26-7.26s-3.243-7.26-7.26-7.26l-26.62 0-24.2-38.72-9.68 0 12.1 38.72-26.62 0-7.26-9.68-7.26 0 4.84 16.94-4.84 16.94 7.26 0 7.26-9.68 26.62 0-12.1 38.72z`;

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
      || drawing.type === DrawingType.Between
      || drawing.type === DrawingType.PathLine )
  );
}

export const getEndPointPosition = ( endPoint: EndPoint, drawings: DrawingMap ): { x: number, y: number } =>
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
      return { x: 0, y: 0 };
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
    else if( anchor.type === DrawingType.PathLine )
    {
      return getEndPointPosition(
        endPoint.startOfPathLine ? anchor.start : anchor.end,
        drawings
      );
    }
    else
    {
      throw assertNever( anchor.type );
    }
  }
};

export interface DraggingInfo
{
  drawingId: string;
  x: number;
  y: number;
}
