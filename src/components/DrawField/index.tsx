import * as React from 'react';
import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva';
import * as uuid from 'uuid/v4';

import Grid from 'components/DrawField/Grid';
import { drawingComponentMap, Between, VerticalGridLine, HorizontalGridLine, ActiveIndication, Plane } from 'components/DrawField/Drawings';
import PathLine from 'components/DrawField/Drawings/PathLine';
import { addDrawing, selectDrawing, deselectDrawing, setOrigin, incrementScaleLevel, decrementScaleLevel, moveDrawing } from 'store/reducers/drawing';
import
{
  DrawingType,
  Drawing,
  DrawingTool,
  Tool,
  DrawingMap,
  getScale,
  drawingTypeColors,
  isValidAnchor,
  AnchorDrawing
} from 'utils/draw';
import { mapToArray, assertNever, distance } from 'utils/utils';

import './styles.css';

interface PropsFromState
{
  tool: DrawingTool;
  scale: number;
  originX: number;
  originY: number;
  gridOn: boolean;
  drawings: DrawingMap;
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

  startAnchor: Drawing | null;
  startTopOfBetween: boolean;

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

      startAnchor: null,
      startTopOfBetween: false,

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
                color: drawingTypeColors[ this.props.tool ],
                x: this.state.startX,
                y: Math.min( this.state.mouseY, this.state.startY ),
                height: Math.abs( this.state.mouseY - this.state.startY ),
                showGuideLine: false,
                guideLine: {
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
                color: drawingTypeColors[ this.props.tool ],
                x: this.state.mouseX,
                y: this.state.mouseY,
                height: 0,
                showGuideLine: false,
                guideLine: {
                  vertical: true
                }
              }}
            />
          );
        }
      }
      else if( this.props.tool === DrawingType.PathLine )
      {
        let result = this.findAnchor( this.state.mouseX, this.state.mouseY );
        if( this.state.startAnchor !== null )
        {
          cursor = (
            <PathLine
              cursor={true}
              drawing={{
                id: uuid(),
                type: this.props.tool,
                color: drawingTypeColors[ this.props.tool ],
                start: {
                  connected: true,
                  anchorId: this.state.startAnchor.id,
                  topOfBetween: this.state.startTopOfBetween
                },
                end: result ?
                  {
                    connected: true,
                    anchorId: result.anchor.id,
                    topOfBetween: result.topOfBetween
                  } :
                  {
                    connected: false,
                    x: this.state.mouseX,
                    y: this.state.mouseY
                  }
              }}
            />
          );
        }
        else if( this.state.startY !== null
          && this.state.startX !== null )
        {
          cursor = (
            <PathLine
              cursor={true}
              drawing={{
                id: uuid(),
                type: this.props.tool,
                color: drawingTypeColors[ this.props.tool ],
                start: {
                  connected: false,
                  x: this.state.startX,
                  y: this.state.startY,
                },
                end: result ?
                  {
                    connected: true,
                    anchorId: result.anchor.id,
                    topOfBetween: result.topOfBetween
                  } :
                  {
                    connected: false,
                    x: this.state.mouseX,
                    y: this.state.mouseY,
                  }
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
                id: uuid(),
                type: this.props.tool,
                color: drawingTypeColors[ this.props.tool ],
                start: result ?
                  {
                    connected: true,
                    anchorId: result.anchor.id,
                    topOfBetween: result.topOfBetween
                  } :
                  {
                    connected: false,
                    x: this.state.mouseX,
                    y: this.state.mouseY,
                  },
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
              id: '',
              type: this.props.tool,
              color: drawingTypeColors[ this.props.tool ],
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
              id: '',
              type: this.props.tool,
              color: drawingTypeColors[ this.props.tool ],
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
              color: drawingTypeColors[ this.props.tool ],
              x: this.state.mouseX,
              y: this.state.mouseY,
              size: 65,
              rotation: 0
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
              color: drawingTypeColors[ this.props.tool ],
              x: this.state.mouseX,
              y: this.state.mouseY,
              showGuideLine: false,
              guideLine: {
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
            {this.props.gridOn &&
              <Grid
                width={this.state.width}
                height={this.state.height}
                originX={this.props.originX}
                originY={this.props.originY}
                scale={this.props.scale}
                verticalInterval={50}
                horizontalInterval={50}
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
    const sortOrderMap: {[ key in DrawingType ]: number } = {
      [ DrawingType.VerticalGridLine ]: 0,
      [ DrawingType.HorizontalGridLine ]: 1,
      [ DrawingType.PathLine ]: 2,
      [ DrawingType.Above ]: 3,
      [ DrawingType.At ]: 4,
      [ DrawingType.Below ]: 5,
      [ DrawingType.Between ]: 6,
      [ DrawingType.Plane ]: 7
    };
    return mapToArray( this.props.drawings ).sort( ( d1, d2 ) =>
    {
      return sortOrderMap[ d1.type ] - sortOrderMap[ d2.type ];
    } );
  }

  private findAnchor( x: number, y: number ): { anchor: AnchorDrawing, topOfBetween: boolean } | null
  {
    let drawings = this.sortedDrawings()
      .reverse()
      .filter( ( drawing ) => isValidAnchor( drawing ) ) as AnchorDrawing[];
    for( let drawing of drawings )
    {
      let { x: dX, y: dY } = drawing;
      if( drawing.type === DrawingType.Between )
      {
        if( distance( dX, dY, x, y ) < 15 )
        {
          return { anchor: drawing, topOfBetween: true };
        }
        else if( distance( dX, dY + drawing.height, x, y ) < 15 )
        {
          return { anchor: drawing, topOfBetween: false };
        }
      }
      else
      {
        if( distance( dX, dY, x, y ) < 15 )
        {
          return { anchor: drawing, topOfBetween: false };
        }
      }
    }
    return null;
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
    return {
      x: ( e.clientX - this.props.originX ) / this.props.scale,
      y: ( e.clientY - this.props.originY ) / this.props.scale
    };
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
            drawingType: this.state.mouseDownDrawing.type,
            deltaX: e.movementX / this.props.scale,
            deltaY: e.movementY / this.props.scale
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
          startAnchor: null,
          startTopOfBetween: false
        } );
      }
    }

    let { x, y } = this.mouseToDrawing( e );

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
      startAnchor: null
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
        let result = this.findAnchor( x, y );
        this.setState( {
          startX: x,
          startY: y,
          startAnchor: result && result.anchor,
          startTopOfBetween: !!result && result.topOfBetween
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

      this.props.deselectDrawing();

      let { x, y } = this.mouseToDrawing( e.evt );

      if( this.props.tool !== Tool.Cursor )
      {
        if( this.props.tool === DrawingType.Between )
        {
          if( this.state.startY !== null && this.state.startX !== null )
          {
            let diff = Math.abs( y - this.state.startY );
            this.props.addDrawing( {
              id: uuid(),
              type: this.props.tool,
              color: drawingTypeColors[ this.props.tool ],
              x: this.state.startX,
              y: Math.min( y, this.state.startY ),
              height: diff,
              showGuideLine: true,
              guideLine: {
                vertical: true
              }
            } );
          }
        }
        else if( this.props.tool === DrawingType.PathLine )
        {
          if( this.state.startY !== null
            && this.state.startX !== null )
          {
            let result = this.findAnchor( x, y );
            this.props.addDrawing( {
              id: uuid(),
              type: this.props.tool,
              color: drawingTypeColors[ this.props.tool ],
              start: this.state.startAnchor ?
                {
                  connected: true,
                  anchorId: this.state.startAnchor.id,
                  topOfBetween: this.state.startTopOfBetween
                } :
                {
                  connected: false,
                  x: this.state.startX,
                  y: this.state.startY,
                },
              end: result ?
                {
                  connected: true,
                  anchorId: result && result.anchor.id,
                  topOfBetween: !!result && result.topOfBetween
                } :
                {
                  connected: false,
                  x: x,
                  y: y
                }
            } );
          }
        }
        else if( this.props.tool === DrawingType.VerticalGridLine )
        {
          this.props.addDrawing( {
            id: uuid(),
            type: this.props.tool,
            color: drawingTypeColors[ this.props.tool ],
            x: x
          } );
        }
        else if( this.props.tool === DrawingType.HorizontalGridLine )
        {
          this.props.addDrawing( {
            id: uuid(),
            type: this.props.tool,
            color: drawingTypeColors[ this.props.tool ],
            y: y
          } );
        }
        else if( this.props.tool === DrawingType.Plane )
        {
          this.props.addDrawing( {
            id: uuid(),
            type: this.props.tool,
            color: drawingTypeColors[ this.props.tool ],
            x: x,
            y: y,
            size: 65,
            rotation: 0
          } );
        }
        else if( this.props.tool === DrawingType.At
          || this.props.tool === DrawingType.Above
          || this.props.tool === DrawingType.Below )
        {
          this.props.addDrawing( {
            id: uuid(),
            type: this.props.tool!,
            color: drawingTypeColors[ this.props.tool ],
            x: x,
            y: y,
            showGuideLine: true,
            guideLine: {
              vertical: true
            }
          } );
        }
        else
        {
          throw assertNever( this.props.tool );
        }
      }
    }

    this.setState( {
      startX: null,
      startY: null,
      startAnchor: null
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
    tool: state.drawing.tool,
    scale: getScale( state.drawing.scaleLevel ),
    originX: state.drawing.originX,
    originY: state.drawing.originY,
    gridOn: state.drawing.gridOn,
    drawings: state.drawing.drawings,
    selectedDrawingId: state.drawing.selectedDrawingId
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
