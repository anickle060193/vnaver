import * as React from 'react';
import { connect } from 'react-redux';

import { addDrawing } from 'store/reducers/drawing';
import { DrawingType, Drawing, DrawingTool, Tool } from 'utils/draw';
import { createBitmapFromSrc } from 'utils/image';

import './styles.css';

const upArrow = require( 'assets/up_arrow.svg' );
const downArrow = require( 'assets/down_arrow.svg' );

const ARROW_SIZE = 30;

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
  canvasRef: HTMLCanvasElement | null;
  upArrowImage: ImageBitmap | null;
  downArrowImage: ImageBitmap | null;

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
    this.canvasRef = null;

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

    this.upArrowImage = await createBitmapFromSrc( upArrow );
    this.downArrowImage = await createBitmapFromSrc( downArrow );

    this.onResize();
    this.draw();
  }

  componentDidUpdate()
  {
    this.draw();
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
        <canvas
          ref={( ref ) => this.canvasRef = ref}
          width={this.state.width}
          height={this.state.height}
          onMouseDown={this.onMouseDown}
          onClick={this.onClick}
        />
      </div>
    );
  }

  private drawDrawing( context: CanvasRenderingContext2D, drawing: Drawing )
  {
    if( !this.upArrowImage || !this.downArrowImage )
    {
      return;
    }

    let { x, y } = drawing;

    if( drawing.type === DrawingType.Above )
    {
      context.drawImage( this.upArrowImage, x - ARROW_SIZE / 2, y - ARROW_SIZE / 2, ARROW_SIZE, ARROW_SIZE );
    }
    else if( drawing.type === DrawingType.Below )
    {
      context.drawImage( this.downArrowImage, x - ARROW_SIZE / 2, y - ARROW_SIZE + 8, ARROW_SIZE, ARROW_SIZE );
    }
    else if( drawing.type === DrawingType.At )
    {
      context.drawImage( this.downArrowImage, x - ARROW_SIZE / 2, y - ARROW_SIZE + 3, ARROW_SIZE, ARROW_SIZE );
      context.drawImage( this.upArrowImage, x - ARROW_SIZE / 2, y - 16, ARROW_SIZE, ARROW_SIZE );
    }
    else if( drawing.type === DrawingType.Between )
    {
      context.drawImage( this.downArrowImage, x - ARROW_SIZE / 2, y - ARROW_SIZE, ARROW_SIZE, ARROW_SIZE );
      context.drawImage( this.upArrowImage, x - ARROW_SIZE / 2, y + drawing.height, ARROW_SIZE, ARROW_SIZE );
    }
  }

  private draw()
  {
    let context = this.canvasRef!.getContext( '2d' )!;

    context.setTransform( 1, 0, 0, 1, 0, 0 );
    context.clearRect( 0, 0, this.state.width, this.state.height );
    context.setTransform( 1, 0, 0, 1, 0.5, 0.5 );
    context.translate( this.state.originX, this.state.originY );
    context.scale( this.state.scale, this.state.scale );

    for( let drawing of this.props.drawings )
    {
      this.drawDrawing( context, drawing );
    }

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
          this.drawDrawing( context, {
            type: this.props.tool,
            x: this.state.startX,
            y: Math.min( this.state.mouseY, this.state.startY ),
            height: Math.abs( this.state.mouseY - this.state.startY )
          } );
        }
        else
        {
          this.drawDrawing( context, {
            type: this.props.tool,
            x: this.state.mouseX,
            y: this.state.mouseY,
            height: 0
          } );
        }
      }
      else if( this.props.tool === DrawingType.At ||
        this.props.tool === DrawingType.Above ||
        this.props.tool === DrawingType.Below )
      {
        this.drawDrawing( context, {
          type: this.props.tool,
          x: this.state.mouseX,
          y: this.state.mouseY
        } );
      }
    }
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

  private onMouseDown = ( e: React.MouseEvent<HTMLCanvasElement> ) =>
  {
    this.moved = false;
    let { x, y } = this.mouseToDrawing( e );
    this.setState( {
      startX: x,
      startY: y
    } );
  }

  private onClick = ( e: React.MouseEvent<HTMLCanvasElement> ) =>
  {
    if( this.moved )
    {
      return;
    }

    let { x, y } = this.mouseToDrawing( e );

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
