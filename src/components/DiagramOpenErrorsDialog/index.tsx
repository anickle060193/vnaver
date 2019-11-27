import React from 'react';
import { connect } from 'react-redux';

import Dialog from 'components/Dialog';
import { clearDiagramOpenErrors } from 'store/reducers/editor';
import { currentEditorState } from 'store/selectors';

import './styles.css';

interface PropsFromState
{
  diagramOpenErrors: string[] | null;
}

interface PropsFromDispatch
{
  clearDiagramOpenErrors: typeof clearDiagramOpenErrors;
}

type Props = PropsFromState & PropsFromDispatch;

class DiagramOpenErrorsDialog extends React.Component<Props>
{
  public render()
  {
    return (
      <Dialog
        show={!!this.props.diagramOpenErrors && this.props.diagramOpenErrors.length > 0}
        onClose={this.onClose}
        closeOnShadeClick={false}
        style={{
          backgroundColor: 'rgb(228, 95, 95)',
          width: '80%',
          margin: '1rem',
          color: 'white'
        }}
      >
        <div className="open-errors-dialog">
          <h1 className="text-center pb-1">Diagram Open Errors</h1>
          <ul>
            {this.props.diagramOpenErrors && this.props.diagramOpenErrors.map( ( error, i ) => (
              <li key={i}>
                {error}
              </li>
            ) )}
          </ul>

          <button
            className="btn btn-outline-light ml-auto"
            type="button"
            onClick={this.onClose}
          >
            Close
          </button>
        </div>
      </Dialog>
    );
  }

  private onClose = () =>
  {
    this.props.clearDiagramOpenErrors();
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    diagramOpenErrors: currentEditorState( state ).diagramOpenErrors
  } ),
  {
    clearDiagramOpenErrors
  }
)( DiagramOpenErrorsDialog );
