import * as React from 'react';
import { connect } from 'react-redux';

import { Drawing } from 'utils/draw';

import './styles.css';

interface PropsFromState
{
  selectedDrawing: Drawing | null;
}

type Props = PropsFromState;

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
        <pre style={{ margin: 0, fontFamily: 'Roboto Mono, monospace', fontSize: '10pt' }}>
          {JSON.stringify( this.props.selectedDrawing, null, 2 )}
        </pre>
      </div>
    );
  }
}

export default connect<PropsFromState, {}, {}, RootState>(
  ( state ) => ( {
    selectedDrawing: state.drawing.selectedDrawing
  } ),
  {
  }
)( DrawingProperties );
