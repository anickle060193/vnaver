import * as React from 'react';
import { connect } from 'react-redux';

import { deleteDrawing, updateDrawing } from 'store/reducers/drawing';
import { Drawing, DrawingType, DrawingMap } from 'utils/draw';

import './styles.css';
import
{
  BasicDrawingProperties,
  BetweenDrawingProperties,
  VerticalGridLineDrawingProperties,
  HorizontalGridLineDrawingProperties,
  PlaneDrawingProperties
} from './DrawingProperties';
import { assertNever } from 'utils/utils';

interface PropsFromState
{
  drawings: DrawingMap;
  selectedDrawingId: string | null;
}

interface PropsFromDispatch
{
  deleteDrawing: typeof deleteDrawing;
  updateDrawing: typeof updateDrawing;
}

type Props = PropsFromState & PropsFromDispatch;

class DrawingProperties extends React.Component<Props>
{
  render()
  {
    if( !this.props.selectedDrawingId )
    {
      return null;
    }

    let selectedDrawing = this.props.drawings[ this.props.selectedDrawingId ];

    let drawingProperties: React.ReactNode;

    if( selectedDrawing.type === DrawingType.Above
      || selectedDrawing.type === DrawingType.At
      || selectedDrawing.type === DrawingType.Below )
    {
      drawingProperties = (
        <BasicDrawingProperties
          drawing={selectedDrawing}
          onChange={this.onDrawingChange}
          onColorChange={( color ) => this.onColorChange( selectedDrawing, color )}
        />
      );
    }
    else if( selectedDrawing.type === DrawingType.Between )
    {
      drawingProperties = (
        <BetweenDrawingProperties
          drawing={selectedDrawing}
          onChange={this.onDrawingChange}
          onColorChange={( color ) => this.onColorChange( selectedDrawing, color )}
        />
      );
    }
    else if( selectedDrawing.type === DrawingType.PathLine )
    {
      drawingProperties = (
        null
      );
    }
    else if( selectedDrawing.type === DrawingType.VerticalGridLine )
    {
      drawingProperties = (
        <VerticalGridLineDrawingProperties
          drawing={selectedDrawing}
          onChange={this.onDrawingChange}
          onColorChange={( color ) => this.onColorChange( selectedDrawing, color )}
        />
      );
    }
    else if( selectedDrawing.type === DrawingType.HorizontalGridLine )
    {
      drawingProperties = (
        <HorizontalGridLineDrawingProperties
          drawing={selectedDrawing}
          onChange={this.onDrawingChange}
          onColorChange={( color ) => this.onColorChange( selectedDrawing, color )}
        />
      );
    }
    else if( selectedDrawing.type === DrawingType.Plane )
    {
      drawingProperties = (
        <PlaneDrawingProperties
          drawing={selectedDrawing}
          onChange={this.onDrawingChange}
          onColorChange={( color ) => this.onColorChange( selectedDrawing, color )}
        />
      );
    }
    else
    {
      throw assertNever( selectedDrawing.type );
    }

    return (
      <div
        className="drawing-properties"
      >
        {drawingProperties}
        <button
          type="button"
          className="btn btn-danger"
          onClick={this.onDeleteClick}
        >
          Delete
        </button>
      </div>
    );
  }

  private onDrawingChange = ( drawing: Drawing ) =>
  {
    this.props.updateDrawing( drawing );
  }

  private onColorChange = ( drawing: Drawing, color: string ) =>
  {
    this.props.updateDrawing( {
      ...drawing,
      color
    } );
  }

  private onDeleteClick = () =>
  {
    if( this.props.selectedDrawingId )
    {
      this.props.deleteDrawing( this.props.selectedDrawingId );
    }
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    drawings: state.drawing.drawings,
    selectedDrawingId: state.drawing.selectedDrawingId
  } ),
  {
    deleteDrawing,
    updateDrawing
  }
)( DrawingProperties );
