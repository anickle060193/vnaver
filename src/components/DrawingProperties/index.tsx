import * as React from 'react';
import { connect } from 'react-redux';

import { deleteDrawing } from 'store/reducers/drawing';
import { Drawing } from 'utils/draw';

import './styles.css';

interface PropsFromState
{
  selectedDrawing: Drawing | null;
}

interface PropsFromDispatch
{
  deleteDrawing: typeof deleteDrawing;
}

type Props = PropsFromState & PropsFromDispatch;

class DrawingProperties extends React.Component<Props>
{
  render()
  {
    return (
      <div
        className={[
          'drawing-properties',
          this.props.selectedDrawing ? 'show' : ''
        ].join( ' ' )}
      >
        <pre style={{ margin: 0, marginBottom: '1rem', fontFamily: 'Roboto Mono, monospace', fontSize: '10pt' }}>
          {JSON.stringify( this.props.selectedDrawing, null, 2 )}
        </pre>
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

  private onDeleteClick = () =>
  {
    if( this.props.selectedDrawing )
    {
      this.props.deleteDrawing( this.props.selectedDrawing );
    }
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    selectedDrawing: state.drawing.selectedDrawing
  } ),
  {
    deleteDrawing
  }
)( DrawingProperties );
