import * as React from 'react';
import { connect } from 'react-redux';

import
{
  BasicDrawingProperties,
  BetweenDrawingProperties,
  VerticalGridLineDrawingProperties,
  HorizontalGridLineDrawingProperties,
  PlaneDrawingProperties,
  PathLineDrawingProperties,
  TextDrawingProperties,
  CurvedLineDrawingProperties
} from './DrawingProperties';
import { deleteDrawing, updateDrawing, deselectDrawing } from 'store/reducers/drawings';
import { currentDrawingsState } from 'store/selectors';
import { Drawing, DrawingType, DrawingMap, drawingToolDisplayNames } from 'utils/draw';
import { assertNever } from 'utils/utils';

import './styles.css';

interface PropsFromState
{
  drawings: DrawingMap;
  selectedDrawingId: string | null;
  transparentDrawingProperties: boolean;
}

interface PropsFromDispatch
{
  deleteDrawing: typeof deleteDrawing;
  updateDrawing: typeof updateDrawing;
  deselectDrawing: typeof deselectDrawing;
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
        <PathLineDrawingProperties
          drawing={selectedDrawing}
          onChange={this.onDrawingChange}
          onColorChange={( color ) => this.onColorChange( selectedDrawing, color )}
        />
      );
    }
    else if( selectedDrawing.type === DrawingType.CurvedLine )
    {
      drawingProperties = (
        <CurvedLineDrawingProperties
          drawing={selectedDrawing}
          onChange={this.onDrawingChange}
          onColorChange={( color ) => this.onColorChange( selectedDrawing, color )}
        />
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
    else if( selectedDrawing.type === DrawingType.Text )
    {
      drawingProperties = (
        <TextDrawingProperties
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
        className={[
          'drawing-properties',
          this.props.transparentDrawingProperties ? 'drawing-properties-transparent' : ''
        ].join( ' ' )}
      >
        <b className="drawing-properties-title">{drawingToolDisplayNames[ selectedDrawing.type ]}</b>
        <button
          type="button"
          className="close drawing-properties-close"
          onClick={this.onCloseClick}
        >
          &times;
        </button>
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

  private onCloseClick = () =>
  {
    this.props.deselectDrawing();
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
    drawings: currentDrawingsState( state ).drawings,
    selectedDrawingId: currentDrawingsState( state ).selectedDrawingId,
    transparentDrawingProperties: state.settings.transparentDrawingProperties
  } ),
  {
    deleteDrawing,
    updateDrawing,
    deselectDrawing
  }
)( DrawingProperties );
