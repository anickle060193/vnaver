import * as React from 'react';
import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva';
import * as uuid from 'uuid/v4';

import { drawingComponentMap, Between, VerticalGridLine, HorizontalGridLine, ActiveIndication } from 'components/DrawField/Drawings';
import PathLine from 'components/DrawField/Drawings/PathLine';
import { addDrawing, selectDrawing, deselectDrawing, setOrigin, incrementScaleLevel, decrementScaleLevel } from 'store/reducers/drawing';
import
{
  DrawingType,
  Drawing,
  DrawingTool,
  Tool,
  DrawingMap,
  getScale,
  drawingTypeColors
} from 'utils/draw';
import { mapToArray, assertNever } from 'utils/utils';

import './styles.css';

interface PropsFromState
{
  tool: DrawingTool;
  scale: number;
  originX: number;
  originY: number;
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
}

type Props = PropsFromState & PropsFromDispatch;

interface State
{
  width: number;
  height: number;

  mouseX: number | null;
  mouseY: number | null;

  startX: number | null;
  startY: number | null;

  ctrlDown: boolean;
}

class DrawField extends React.Component<Props, State>
{
  drawFieldRef: HTMLDivElement | null;

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

      startX: null,
      startY: null,

      ctrlDown: false
    };

    this.drawFieldRef = null;

    this.moved = false;
    this.clickHandled = false;
  }

  async componentDidMount()
  {
    window.addEventListener( 'resize', this.onResize );
    document.addEventListener( 'mousemove', this.onMouseMove );
    document.addEventListener( 'mouseout', this.onMouseOut );
    document.addEventListener( 'mousewheel', this.onMouseWheel );
    document.addEventListener( 'keydown', this.onKeyUpDown );
    document.addEventListener( 'keyup', this.onKeyUpDown );

    this.onResize();
  }

  componentWillUnmount()
  {
    window.removeEventListener( 'resize', this.onResize );
    document.removeEventListener( 'mousemove', this.onMouseMove );
    document.removeEventListener( 'mouseout', this.onMouseOut );
    document.removeEventListener( 'mousewheel', this.onMouseWheel );
    document.removeEventListener( 'keydown', this.onKeyUpDown );
    document.removeEventListener( 'keyup', this.onKeyUpDown );
  }

  render()
  {
    let cursor: React.ReactNode | null = null;

    if( !this.state.ctrlDown
      && this.props.tool !== Tool.Cursor
      && this.props.tool !== Tool.Move
      && this.state.mouseX !== null
      && this.state.mouseY !== null )
    {
      if( this.props.tool === DrawingType.Between )
      {
        if( this.state.startY !== null && this.state.startX !== null )
        {
          cursor = (
            <Between
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
        if( this.state.startY !== null
          && this.state.startX !== null )
        {
          cursor = (
            <PathLine
              drawing={{
                id: uuid(),
                type: this.props.tool,
                color: drawingTypeColors[ this.props.tool ],
                start: {
                  connected: false,
                  x: this.state.startX,
                  y: this.state.startY,
                },
                end: {
                  connected: false,
                  x: this.state.mouseX,
                  y: this.state.mouseY
                }
              }}
            />
          );
        }
        else
        {
          cursor = (
            <PathLine
              drawing={{
                id: uuid(),
                type: this.props.tool,
                color: drawingTypeColors[ this.props.tool ],
                start: {
                  connected: false,
                  x: this.state.mouseX,
                  y: this.state.mouseY,
                },
                end: {
                  connected: false,
                  x: this.state.mouseX,
                  y: this.state.mouseY
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
            drawing={{
              id: '',
              type: this.props.tool,
              color: drawingTypeColors[ this.props.tool ],
              y: this.state.mouseY
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

    let drawings = mapToArray( this.props.drawings ).sort( ( d1, d2 ) =>
    {
      if( d1.type === d2.type )
      {
        return 0;
      }
      else if( d1.type === DrawingType.HorizontalGridLine )
      {
        return -1;
      }
      else if( d2.type === DrawingType.HorizontalGridLine )
      {
        return 1;
      }
      else if( d1.type === DrawingType.VerticalGridLine )
      {
        return -1;
      }
      else if( d2.type === DrawingType.VerticalGridLine )
      {
        return 1;
      }
      else
      {
        return 0;
      }
    } );

    return (
      <div
        ref={( ref ) => this.drawFieldRef = ref}
        className="draw-field"
        style={{
          cursor: ( this.props.tool === Tool.Move || this.state.ctrlDown ) ? 'move' : 'unset'
        }}
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
        >
          <Layer>
            {drawings.map( ( drawing, i ) =>
            {
              let DrawingComponent = drawingComponentMap[ drawing.type ];
              return (
                <DrawingComponent
                  key={i}
                  drawing={drawing}
                  onClick={( e ) => this.onDrawingClick( drawing, e )}
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

  private onKeyUpDown = ( e: KeyboardEvent ) =>
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

  private onMouseWheel = ( e: MouseWheelEvent ) =>
  {
    e.preventDefault();

    if( e.ctrlKey )
    {
      if( e.wheelDelta < 0 )
      {
        this.props.decrementScaleLevel();
      }
      else
      {
        this.props.incrementScaleLevel();
      }
    }
  }

  private onMouseMove = ( e: MouseEvent ) =>
  {
    if( ( e.buttons & 1 ) === 1 ) // tslint:disable-line no-bitwise
    {
      if( this.props.tool === Tool.Move ||
        e.ctrlKey )
      {
        this.moved = true;

        let originX = this.props.originX + e.movementX;
        let originY = this.props.originY + e.movementY;
        this.props.setOrigin( { originX, originY } );
      }
    }

    let { x, y } = this.mouseToDrawing( e );

    this.setState( {
      mouseX: x,
      mouseY: y
    } );
  }

  private onMouseOut = () =>
  {
    this.setState( {
      mouseX: null,
      mouseY: null
    } );
  }

  private onContentMouseDown = ( e: KonvaMouseEvent<{}> ) =>
  {
    this.moved = false;

    if( e.evt.button === 0 ) // tslint:disable-line no-bitwise
    {
      if( this.props.tool === DrawingType.Between
        || this.props.tool === DrawingType.PathLine )
      {
        let { x, y } = this.mouseToDrawing( e.evt );
        this.setState( {
          startX: x,
          startY: y
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

      if( this.props.tool !== Tool.Cursor
        && this.props.tool !== Tool.Move )
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
            this.props.addDrawing( {
              id: uuid(),
              type: this.props.tool,
              color: drawingTypeColors[ this.props.tool ],
              start: {
                connected: false,
                x: this.state.startX,
                y: this.state.startY,
              },
              end: {
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
      startY: null
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

      this.props.selectDrawing( drawing.id );
    }
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    tool: state.drawing.tool,
    scale: getScale( state.drawing.scaleLevel ),
    originX: state.drawing.originX,
    originY: state.drawing.originY,
    drawings: state.drawing.drawings,
    selectedDrawingId: state.drawing.selectedDrawingId
  } ),
  {
    incrementScaleLevel,
    decrementScaleLevel,
    setOrigin,
    addDrawing,
    selectDrawing,
    deselectDrawing
  }
)( DrawField );
