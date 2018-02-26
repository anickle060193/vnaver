import * as React from 'react';
import { connect } from 'react-redux';
import { Stage, Layer, Rect } from 'react-konva';
import * as uuid from 'uuid/v4';

import Grid from 'components/DrawField/Grid';
import { drawingComponentMap, Between, VerticalGridLine, HorizontalGridLine, ActiveIndication, Plane, Text } from 'components/DrawField/Drawings';
import PathLine from 'components/DrawField/Drawings/PathLine';
import { addDrawing, selectDrawing, deselectDrawing, moveDrawing } from 'store/reducers/drawings';
import { incrementScaleLevel, decrementScaleLevel, setOrigin } from 'store/reducers/editor';
import
{
  DrawingType,
  Drawing,
  DrawingTool,
  Tool,
  DrawingMap,
  getScale,
  isValidAnchor,
  DrawingTypeMap,
  EndPoint,
  getEndPointPosition,
  LineStyle,
  LineDashStyle,
  HorizontalAlign,
  VerticalAlign
} from 'utils/draw';
import { mapToArray, assertNever, distance, roundToNearest } from 'utils/utils';

import './styles.css';

const DEFAULT_LINE_STYLE: LineStyle = {
  dash: LineDashStyle.LooselyDashed,
  strokeWidth: 2
};

const DEFAULT_GUIDE_LINE_STYLE: LineStyle = {
  dash: LineDashStyle.Solid,
  strokeWidth: 0.5
};

const DEFAULT_PATH_LINE_STYLE: LineStyle = {
  dash: LineDashStyle.Solid,
  strokeWidth: 2
};

const DEFAULT_TEXT_DRAWING = {
  fontSize: 24,
  horizontalAlign: HorizontalAlign.Left,
  verticalAlign: VerticalAlign.Top,
  text: 'Text'
};

const NEAR_DISTANCE = 15;

interface PropsFromState
{
  tool: DrawingTool;
  scale: number;
  originX: number;
  originY: number;
  gridOn: boolean;
  snapToGrid: boolean;
  gridIntervalX: number;
  gridIntervalY: number;
  drawings: DrawingMap;
  defaultDrawingColors: DrawingTypeMap<string>;
  selectedDrawingId: string | null;
}

interface PropsFromDispatch
{
  incrementScaleLevel: typeof incrementScaleLevel;
  decrementScaleLevel: typeof decrementScaleLevel;
  setOrigin: typeof setOrigin;
  addDrawing: typeof addDrawing;
  selectDrawing: typeof selectDrawing;
  deselectDrawing: typeof deselectDrawing;
  moveDrawing: typeof moveDrawing;
}

type Props = PropsFromState & PropsFromDispatch;

interface State
{
  width: number;
  height: number;

  mouseX: number | null;
  mouseY: number | null;

  mouseDownDrawing: Drawing | null;
  dragging: boolean;

  startX: number | null;
  startY: number | null;

  startEndPoint: EndPoint | null;

  ctrlDown: boolean;
}

class DrawField extends React.Component<Props, State>
{
  drawFieldRef: HTMLDivElement | null;

  mouseDown: boolean;
  moved: boolean;
  clickHandled: boolean;

  constructor( props: Props )
  {
    super( props );

    this.state = {
      width: 100,
      height: 100,

      mouseX: null,
      mouseY: null,

      mouseDownDrawing: null,
      dragging: false,

      startX: null,
      startY: null,

      startEndPoint: null,

      ctrlDown: false
    };

    this.drawFieldRef = null;

    this.mouseDown = false;
    this.moved = false;
    this.clickHandled = false;
  }

  async componentDidMount()
  {
    window.addEventListener( 'resize', this.onResize );
    document.addEventListener( 'mousemove', this.onDocumentMouseMove );
    document.addEventListener( 'mouseout', this.onDocumentMouseOut );
    document.addEventListener( 'mouseup', this.onDocumentMouseUp );
    document.addEventListener( 'mousewheel', this.onDocumentMouseWheel );
    document.addEventListener( 'keydown', this.onDocumentKeyUpDown );
    document.addEventListener( 'keyup', this.onDocumentKeyUpDown );

    this.onResize();
  }

  componentWillUnmount()
  {
    window.removeEventListener( 'resize', this.onResize );
    document.removeEventListener( 'mousemove', this.onDocumentMouseMove );
    document.removeEventListener( 'mouseout', this.onDocumentMouseOut );
    document.removeEventListener( 'mouseup', this.onDocumentMouseUp );
    document.removeEventListener( 'mousewheel', this.onDocumentMouseWheel );
    document.removeEventListener( 'keydown', this.onDocumentKeyUpDown );
    document.removeEventListener( 'keyup', this.onDocumentKeyUpDown );
  }

  render()
  {
    let cursor: React.ReactNode | null = null;

    if( !this.state.ctrlDown
      && this.props.tool !== Tool.Cursor
      && this.state.mouseX !== null
      && this.state.mouseY !== null )
    {
      if( this.props.tool === DrawingType.Between )
      {
        if( this.state.startY !== null && this.state.startX !== null )
        {
          cursor = (
            <Between
              cursor={true}
              drawing={{
                id: '',
                type: this.props.tool,
                color: this.props.defaultDrawingColors[ this.props.tool ],
                x: this.state.startX,
                y: Math.min( this.state.mouseY, this.state.startY ),
                height: Math.abs( this.state.mouseY - this.state.startY ),
                showGuideLine: false,
                guideLine: {
                  ...DEFAULT_GUIDE_LINE_STYLE,
                  vertical: true
                }
              }}
            />
          );
        }
        else
        {
          cursor = (
            <Between
              cursor={true}
              drawing={{
                id: '',
                type: this.props.tool,
                color: this.props.defaultDrawingColors[ this.props.tool ],
                x: this.state.mouseX,
                y: this.state.mouseY,
                height: 0,
                showGuideLine: false,
                guideLine: {
                  ...DEFAULT_GUIDE_LINE_STYLE,
                  vertical: true
                }
              }}
            />
          );
        }
      }
      else if( this.props.tool === DrawingType.PathLine )
      {
        let endPoint = this.findEndPoint( this.state.mouseX, this.state.mouseY );
        if( this.state.startEndPoint !== null )
        {
          cursor = (
            <PathLine
              cursor={true}
              drawing={{
                ...DEFAULT_PATH_LINE_STYLE,
                id: '',
                type: this.props.tool,
                color: this.props.defaultDrawingColors[ this.props.tool ],
                start: this.state.startEndPoint,
                end: endPoint
              }}
            />
          );
        }
        else
        {
          cursor = (
            <PathLine
              cursor={true}
              drawing={{
                ...DEFAULT_PATH_LINE_STYLE,
                id: '',
                type: this.props.tool,
                color: this.props.defaultDrawingColors[ this.props.tool ],
                start: endPoint,
                end: {
                  connected: false,
                  x: NaN,
                  y: NaN
                }
              }}
            />
          );
        }
      }
      else if( this.props.tool === DrawingType.VerticalGridLine )
      {
        cursor = (
          <VerticalGridLine
            cursor={true}
            drawing={{
              ...DEFAULT_LINE_STYLE,
              id: '',
              type: this.props.tool,
              color: this.props.defaultDrawingColors[ this.props.tool ],
              x: this.state.mouseX
            }}
          />
        );
      }
      else if( this.props.tool === DrawingType.HorizontalGridLine )
      {
        cursor = (
          <HorizontalGridLine
            cursor={true}
            drawing={{
              ...DEFAULT_LINE_STYLE,
              id: '',
              type: this.props.tool,
              color: this.props.defaultDrawingColors[ this.props.tool ],
              y: this.state.mouseY
            }}
          />
        );
      }
      else if( this.props.tool === DrawingType.Plane )
      {
        cursor = (
          <Plane
            drawing={{
              id: '',
              type: this.props.tool,
              color: this.props.defaultDrawingColors[ this.props.tool ],
              x: this.state.mouseX,
              y: this.state.mouseY,
              size: 65,
              rotation: 0
            }}
          />
        );
      }
      else if( this.props.tool === DrawingType.Text )
      {
        cursor = (
          <Text
            drawing={{
              id: '',
              type: this.props.tool,
              color: this.props.defaultDrawingColors[ this.props.tool ],
              x: this.state.mouseX,
              y: this.state.mouseY,
              ...DEFAULT_TEXT_DRAWING
            }}
          />
        );
      }
      else if( this.props.tool === DrawingType.At ||
        this.props.tool === DrawingType.Above ||
        this.props.tool === DrawingType.Below )
      {
        let CursorComponent = drawingComponentMap[ this.props.tool ];
        cursor = (
          <CursorComponent
            cursor={true}
            drawing={{
              id: '',
              type: this.props.tool,
              color: this.props.defaultDrawingColors[ this.props.tool ],
              x: this.state.mouseX,
              y: this.state.mouseY,
              showGuideLine: false,
              guideLine: {
                ...DEFAULT_GUIDE_LINE_STYLE,
                vertical: true
              }
            }}
          />
        );
      }
      else
      {
        throw assertNever( this.props.tool );
      }
    }

    let cssCursor: string;
    if( this.state.ctrlDown )
    {
      cssCursor = 'move';
    }
    else if( this.state.dragging )
    {
      cssCursor = '-webkit-grabbing';
    }
    else
    {
      cssCursor = 'default';
    }

    return (
      <div
        ref={( ref ) => this.drawFieldRef = ref}
        className="draw-field"
        style={{ cursor: cssCursor }}
      >
        <Stage
          width={this.state.width}
          height={this.state.height}
          scaleX={this.props.scale}
          scaleY={this.props.scale}
          x={this.props.originX}
          y={this.props.originY}
          onContentMouseDown={this.onContentMouseDown}
          onContentClick={this.onContentClick}
          onContentMouseUp={this.onContentMouseUp}
        >
          <Layer>
            <Rect
              x={-this.props.originX / this.props.scale}
              y={-this.props.originY / this.props.scale}
              width={this.state.width / this.props.scale}
              height={this.state.height / this.props.scale}
              fill="white"
            />
            {this.props.gridOn &&
              <Grid
                width={this.state.width}
                height={this.state.height}
                originX={this.props.originX}
                originY={this.props.originY}
                scale={this.props.scale}
                verticalInterval={this.props.gridIntervalX}
                horizontalInterval={this.props.gridIntervalY}
              />}
            {this.sortedDrawings().map( ( drawing, i ) =>
            {
              let DrawingComponent = drawingComponentMap[ drawing.type ];
              return (
                <DrawingComponent
                  key={i}
                  drawing={drawing}
                  onClick={( e ) => this.onDrawingClick( drawing, e )}
                  onMouseDown={( e ) => this.onDrawingMouseDown( drawing, e )}
                />
              );
            } )}
            {cursor}
            <ActiveIndication
              drawings={this.props.drawings}
              drawing={this.props.drawings[ this.props.selectedDrawingId! ]}
              originX={this.props.originX}
              originY={this.props.originY}
              scale={this.props.scale}
              fieldWidth={this.state.width}
              fieldHeight={this.state.height}
            />
          </Layer>
        </Stage>
      </div>
    );
  }

  private sortedDrawings()
  {
    const sortOrderMap: DrawingTypeMap<number> = {
      [ DrawingType.VerticalGridLine ]: 0,
      [ DrawingType.HorizontalGridLine ]: 1,
      [ DrawingType.PathLine ]: 2,
      [ DrawingType.Above ]: 3,
      [ DrawingType.At ]: 4,
      [ DrawingType.Below ]: 5,
      [ DrawingType.Between ]: 6,
      [ DrawingType.Plane ]: 7,
      [ DrawingType.Text ]: 8
    };
    return mapToArray( this.props.drawings ).sort( ( d1, d2 ) =>
    {
      return sortOrderMap[ d1.type ] - sortOrderMap[ d2.type ];
    } );
  }

  private findEndPoint( x: number, y: number ): EndPoint
  {
    for( let drawing of this.sortedDrawings().reverse() )
    {
      if( isValidAnchor( drawing ) )
      {
        if( drawing.type === DrawingType.Between )
        {
          let { x: dX, y: dY } = drawing;
          if( distance( dX, dY, x, y ) < NEAR_DISTANCE )
          {
            return {
              connected: true,
              anchorId: drawing.id,
              topOfBetween: true,
              startOfPathLine: false
            };
          }
          else if( distance( dX, dY + drawing.height, x, y ) < NEAR_DISTANCE )
          {
            return {
              connected: true,
              anchorId: drawing.id,
              topOfBetween: false,
              startOfPathLine: false
            };
          }
        }
        else if( drawing.type === DrawingType.At
          || drawing.type === DrawingType.Above
          || drawing.type === DrawingType.Below )
        {
          let { x: dX, y: dY } = drawing;
          if( distance( dX, dY, x, y ) < NEAR_DISTANCE )
          {
            return {
              connected: true,
              anchorId: drawing.id,
              topOfBetween: false,
              startOfPathLine: false
            };
          }
        }
        else if( drawing.type === DrawingType.PathLine )
        {
          let start = getEndPointPosition( drawing.start, this.props.drawings );
          if( start )
          {
            if( distance( x, y, start.x, start.y ) < NEAR_DISTANCE )
            {
              return {
                connected: true,
                anchorId: drawing.id,
                startOfPathLine: true,
                topOfBetween: false
              };
            }
          }

          let end = getEndPointPosition( drawing.end, this.props.drawings );
          if( end )
          {
            if( distance( x, y, end.x, end.y ) < NEAR_DISTANCE )
            {
              return {
                connected: true,
                anchorId: drawing.id,
                startOfPathLine: false,
                topOfBetween: false
              };
            }
          }
        }
        else
        {
          throw assertNever( drawing.type );
        }
      }
    }
    return {
      connected: false,
      x,
      y
    };
  }

  private onResize = () =>
  {
    if( this.drawFieldRef )
    {
      this.setState( {
        width: this.drawFieldRef.clientWidth,
        height: this.drawFieldRef.clientHeight
      } );
    }
  }

  private onDocumentKeyUpDown = ( e: KeyboardEvent ) =>
  {
    this.setState( { ctrlDown: e.ctrlKey } );
  }

  private mouseToDrawing( e: { clientX: number, clientY: number } )
  {
    let x = ( e.clientX - this.props.originX ) / this.props.scale;
    let y = ( e.clientY - this.props.originY ) / this.props.scale;
    if( this.props.gridOn && this.props.snapToGrid )
    {
      return {
        x: roundToNearest( x, this.props.gridIntervalX ),
        y: roundToNearest( y, this.props.gridIntervalY )
      };
    }
    else
    {
      return { x, y };
    }
  }

  private onDocumentMouseWheel = ( e: MouseWheelEvent ) =>
  {
    e.preventDefault();

    if( e.wheelDelta < 0 )
    {
      this.props.decrementScaleLevel();
    }
    else
    {
      this.props.incrementScaleLevel();
    }
  }

  private onDocumentMouseMove = ( e: MouseEvent ) =>
  {
    let { x, y } = this.mouseToDrawing( e );

    if( ( e.buttons & 1 ) === 1 // tslint:disable-line no-bitwise
      && this.mouseDown )
    {
      if( e.ctrlKey )
      {
        this.moved = true;

        let originX = this.props.originX + e.movementX;
        let originY = this.props.originY + e.movementY;
        this.props.setOrigin( { originX, originY } );
      }
      else if( this.state.mouseDownDrawing )
      {
        this.moved = true;

        if( this.state.mouseDownDrawing.type !== DrawingType.PathLine )
        {
          this.setState( { dragging: true } );

          this.props.moveDrawing( {
            drawingId: this.state.mouseDownDrawing.id,
            x,
            y
          } );
        }
      }
      else if( this.props.tool === Tool.Cursor )
      {
        this.moved = true;

        this.setState( { dragging: true } );

        let originX = this.props.originX + e.movementX;
        let originY = this.props.originY + e.movementY;
        this.props.setOrigin( { originX, originY } );
      }

      if( this.moved )
      {
        this.setState( {
          startX: null,
          startY: null,
          startEndPoint: null
        } );
      }
    }

    this.setState( {
      mouseX: x,
      mouseY: y
    } );
  }

  private onDocumentMouseOut = () =>
  {
    this.setState( {
      mouseX: null,
      mouseY: null,
      startX: null,
      startY: null,
      startEndPoint: null
    } );
  }

  private onDocumentMouseUp = ( e: MouseEvent ) =>
  {
    if( e.button === 0 )
    {
      this.mouseDown = false;
    }
  }

  private onContentMouseDown = ( e: KonvaMouseEvent<{}> ) =>
  {
    if( e.evt.button === 0 ) // tslint:disable-line no-bitwise
    {
      this.moved = false;
      this.mouseDown = true;

      let { x, y } = this.mouseToDrawing( e.evt );
      if( this.props.tool === DrawingType.Between )
      {
        this.setState( {
          startX: x,
          startY: y
        } );
      }
      else if( this.props.tool === DrawingType.PathLine )
      {
        this.setState( {
          startEndPoint: this.findEndPoint( x, y )
        } );
      }
    }
  }

  private onContentClick = ( e: KonvaMouseEvent<{}> ) =>
  {
    if( e.evt.button === 0 )
    {
      if( this.clickHandled )
      {
        this.clickHandled = false;
        return;
      }

      if( this.moved )
      {
        return;
      }

      let added = false;

      let { x, y } = this.mouseToDrawing( e.evt );

      if( this.props.tool !== Tool.Cursor )
      {
        if( this.props.tool === DrawingType.Between )
        {
          if( this.state.startY !== null && this.state.startX !== null )
          {
            added = true;
            let diff = Math.abs( y - this.state.startY );
            this.props.addDrawing( {
              id: uuid(),
              type: this.props.tool,
              color: this.props.defaultDrawingColors[ this.props.tool ],
              x: this.state.startX,
              y: Math.min( y, this.state.startY ),
              height: diff,
              showGuideLine: true,
              guideLine: {
                ...DEFAULT_GUIDE_LINE_STYLE,
                vertical: true
              }
            } );
          }
        }
        else if( this.props.tool === DrawingType.PathLine )
        {
          if( this.state.startEndPoint !== null )
          {
            added = true;
            this.props.addDrawing( {
              ...DEFAULT_PATH_LINE_STYLE,
              id: uuid(),
              type: this.props.tool,
              color: this.props.defaultDrawingColors[ this.props.tool ],
              start: this.state.startEndPoint,
              end: this.findEndPoint( x, y )
            } );
          }
        }
        else if( this.props.tool === DrawingType.VerticalGridLine )
        {
          added = true;
          this.props.addDrawing( {
            ...DEFAULT_LINE_STYLE,
            id: uuid(),
            type: this.props.tool,
            color: this.props.defaultDrawingColors[ this.props.tool ],
            x: x
          } );
        }
        else if( this.props.tool === DrawingType.HorizontalGridLine )
        {
          added = true;
          this.props.addDrawing( {
            ...DEFAULT_LINE_STYLE,
            id: uuid(),
            type: this.props.tool,
            color: this.props.defaultDrawingColors[ this.props.tool ],
            y: y
          } );
        }
        else if( this.props.tool === DrawingType.Plane )
        {
          added = true;
          this.props.addDrawing( {
            id: uuid(),
            type: this.props.tool,
            color: this.props.defaultDrawingColors[ this.props.tool ],
            x: x,
            y: y,
            size: 65,
            rotation: 0
          } );
        }
        else if( this.props.tool === DrawingType.Text )
        {
          added = true;
          this.props.addDrawing( {
            id: uuid(),
            type: this.props.tool,
            color: this.props.defaultDrawingColors[ this.props.tool ],
            x: x,
            y: y,
            ...DEFAULT_TEXT_DRAWING
          } );
        }
        else if( this.props.tool === DrawingType.At
          || this.props.tool === DrawingType.Above
          || this.props.tool === DrawingType.Below )
        {
          added = true;
          this.props.addDrawing( {
            id: uuid(),
            type: this.props.tool!,
            color: this.props.defaultDrawingColors[ this.props.tool ],
            x: x,
            y: y,
            showGuideLine: true,
            guideLine: {
              ...DEFAULT_GUIDE_LINE_STYLE,
              vertical: true
            }
          } );
        }
        else
        {
          throw assertNever( this.props.tool );
        }
      }

      if( !added )
      {
        this.props.deselectDrawing();
      }
    }

    this.setState( {
      startX: null,
      startY: null,
      startEndPoint: null
    } );
  }

  private onContentMouseUp = ( e: KonvaMouseEvent<{}> ) =>
  {
    this.setState( {
      mouseDownDrawing: null,
      dragging: false
    } );
  }

  private onDrawingClick = ( drawing: Drawing, e: KonvaMouseEvent<{}> ) =>
  {
    if( e.evt.button === 0 )
    {
      if( this.moved )
      {
        return;
      }

      this.clickHandled = true;
    }
  }

  private onDrawingMouseDown = ( drawing: Drawing, e: KonvaMouseEvent<{}> ) =>
  {
    if( e.evt.button === 0 )
    {
      if( this.props.tool === Tool.Cursor )
      {
        this.props.selectDrawing( drawing.id );

        if( drawing.type !== DrawingType.PathLine )
        {
          this.setState( { mouseDownDrawing: drawing } );
        }
      }
    }
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    tool: state.editor.tool,
    scale: getScale( state.editor.scaleLevel ),
    originX: state.editor.originX,
    originY: state.editor.originY,
    gridOn: state.settings.gridOn,
    snapToGrid: state.settings.snapToGrid,
    gridIntervalX: state.settings.gridIntervalX,
    gridIntervalY: state.settings.gridIntervalY,
    drawings: state.drawings.present.drawings,
    defaultDrawingColors: state.settings.defaultDrawingColors,
    selectedDrawingId: state.drawings.present.selectedDrawingId
  } ),
  {
    incrementScaleLevel,
    decrementScaleLevel,
    setOrigin,
    addDrawing,
    selectDrawing,
    deselectDrawing,
    moveDrawing
  }
)( DrawField );
