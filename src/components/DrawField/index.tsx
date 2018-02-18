import * as React from 'react';
import { connect } from 'react-redux';
import { Stage, Image, Layer } from 'react-konva';

import { addDrawing } from 'store/reducers/drawing';
import { DrawingType, Drawing, DrawingTool, Tool, BetweenDrawing } from 'utils/draw';

import './styles.css';

const upArrowImage = document.createElement( 'img' );
upArrowImage.src = require( 'assets/up_arrow.svg' );

const downArrowImage = document.createElement( 'img' );
downArrowImage.src = require( 'assets/down_arrow.svg' );

const ARROW_SIZE = 30;

const Above: React.SFC<{
  drawing: Drawing;
}> = ( { drawing } ) => (
  <Image
    x={drawing.x - ARROW_SIZE / 2}
    y={drawing.y - ARROW_SIZE / 2}
    width={ARROW_SIZE}
    height={ARROW_SIZE}
    image={upArrowImage}
  />
);

const At: React.SFC<{
  drawing: Drawing;
}> = ( { drawing } ) => (
  <>
    <Image
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y - ARROW_SIZE + 3}
      width={ARROW_SIZE}
      height={ARROW_SIZE}
      image={downArrowImage}
    />
    <Image
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y - 16}
      width={ARROW_SIZE}
      height={ARROW_SIZE}
      image={upArrowImage}
    />
  </>
);

const Below: React.SFC<{
  drawing: Drawing;
}> = ( { drawing } ) => (
  <Image
    x={drawing.x - ARROW_SIZE / 2}
    y={drawing.y - ARROW_SIZE + 8}
    width={ARROW_SIZE}
    height={ARROW_SIZE}
    image={downArrowImage}
  />
);

const Between: React.SFC<{
  drawing: BetweenDrawing;
}> = ( { drawing } ) => (
  <>
    <Image
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y - ARROW_SIZE}
      width={ARROW_SIZE}
      height={ARROW_SIZE}
      image={downArrowImage}
    />
    <Image
      x={drawing.x - ARROW_SIZE / 2}
      y={drawing.y + drawing.height}
      width={ARROW_SIZE}
      height={ARROW_SIZE}
      image={upArrowImage}
    />
  </>
);

const drawingMap: {[ key in DrawingType ]: React.SFC<{ drawing: Drawing }> } = {
  [ DrawingType.Above ]: Above,
  [ DrawingType.At ]: At,
  [ DrawingType.Below ]: Below,
  [ DrawingType.Between ]: Between
};

interface PropsFromState
{
  tool: DrawingTool | null;
  drawings: Drawing[];
}

interface PropsFromDispatch
{
  addDrawing: typeof addDrawing;
}

type Props = PropsFromState & PropsFromDispatch;

interface State
{
  width: number;
  height: number;

  originX: number;
  originY: number;
  scale: number;

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

  constructor( props: Props )
  {
    super( props );

    this.state = {
      width: 100,
      height: 100,

      originX: 0,
      originY: 0,
      scale: 1,

      mouseX: null,
      mouseY: null,

      startX: null,
      startY: null,

      ctrlDown: false
    };

    this.drawFieldRef = null;

    this.moved = false;
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
    let CursorComponent: typeof drawingMap[ DrawingType ] | null = null;
    let cursorDrawing: Drawing | null = null;

    if( !this.state.ctrlDown
      && this.props.tool
      && this.props.tool !== Tool.Move
      && this.state.mouseX !== null
      && this.state.mouseY !== null )
    {
      if( this.props.tool === DrawingType.Between )
      {
        if( this.state.startY !== null && this.state.startX !== null )
        {
          CursorComponent = Between;
          cursorDrawing = {
            type: DrawingType.Between,
            x: this.state.startX,
            y: Math.min( this.state.mouseY, this.state.startY ),
            height: Math.abs( this.state.mouseY - this.state.startY )
          };
        }
        else
        {
          CursorComponent = Between;
          cursorDrawing = {
            type: DrawingType.Between,
            x: this.state.mouseX,
            y: this.state.mouseY,
            height: 0
          };
        }
      }
      else if( this.props.tool === DrawingType.At ||
        this.props.tool === DrawingType.Above ||
        this.props.tool === DrawingType.Below )
      {
        CursorComponent = drawingMap[ this.props.tool ];
        cursorDrawing = {
          type: this.props.tool,
          x: this.state.mouseX,
          y: this.state.mouseY
        };
      }
    }

    return (
      <div
        ref={( ref ) => this.drawFieldRef = ref}
        className="draw-field"
        style={{
          cursor: ( this.props.tool === Tool.Move || this.state.ctrlDown ) ? 'move' : 'unset'
        }}
      >
        <div
          className="drawing-scale"
          onClick={this.onResetScale}
        >
          x{this.state.scale.toFixed( 2 )}
        </div>
        <Stage
          width={this.state.width}
          height={this.state.height}
          scaleX={this.state.scale}
          scaleY={this.state.scale}
          x={this.state.originX}
          y={this.state.originY}
          onContentMouseDown={this.onMouseDown}
          onContentClick={this.onClick}
        >
          <Layer>
            {this.props.drawings.map( ( drawing, i ) =>
            {
              let DrawingComponent = drawingMap[ drawing.type ];
              return (
                <DrawingComponent key={i} drawing={drawing} />
              );
            } )}
            {CursorComponent && cursorDrawing && (
              <CursorComponent drawing={cursorDrawing} />
            )}
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

  private onResetScale = () =>
  {
    this.setState( { scale: 1 } );
  }

  private mouseToDrawing( e: { clientX: number, clientY: number } )
  {
    return {
      x: ( e.clientX - this.state.originX ) / this.state.scale,
      y: ( e.clientY - this.state.originY ) / this.state.scale
    };
  }

  private onMouseWheel = ( e: MouseWheelEvent ) =>
  {
    e.preventDefault();

    if( e.ctrlKey )
    {
      let scaleDiff = e.wheelDelta / 1000;
      this.setState( ( { scale }: State ) => ( {
        scale: scale + scaleDiff
      } ) );
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

        this.setState( ( prevState: State ) => ( {
          originX: prevState.originX + e.movementX,
          originY: prevState.originY + e.movementY
        } ) );
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

  private onMouseDown = ( e: KonvaMouseEvent<{}> ) =>
  {
    this.moved = false;
    if( this.props.tool === DrawingType.Between )
    {
      let { x, y } = this.mouseToDrawing( e.evt );
      this.setState( {
        startX: x,
        startY: y
      } );
    }
  }

  private onClick = ( e: KonvaMouseEvent<{}> ) =>
  {
    if( this.moved )
    {
      return;
    }

    let { x, y } = this.mouseToDrawing( e.evt );

    if( this.props.tool )
    {
      if( this.props.tool === DrawingType.Between )
      {
        if( this.state.startY !== null && this.state.startX !== null )
        {
          let diff = Math.abs( y - this.state.startY );
          this.props.addDrawing( {
            type: this.props.tool,
            x: this.state.startX,
            y: Math.min( y, this.state.startY ),
            height: diff
          } );
        }
      }
      else if( this.props.tool === DrawingType.At
        || this.props.tool === DrawingType.Above
        || this.props.tool === DrawingType.Below )
      {
        this.props.addDrawing( {
          type: this.props.tool!,
          x: x,
          y: y
        } );
      }
    }

    this.setState( {
      startX: null,
      startY: null
    } );
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    tool: state.drawing.tool,
    drawings: state.drawing.drawings
  } ),
  {
    addDrawing
  }
)( DrawField );
