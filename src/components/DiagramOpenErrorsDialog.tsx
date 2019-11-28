import React from 'react';
import { connect } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

import { clearDiagramOpenErrors } from 'store/reducers/editor';
import { currentEditorState } from 'store/selectors';

interface PropsFromState
{
  diagramOpenErrors: string[] | null;
}

interface PropsFromDispatch
{
  clearDiagramOpenErrors: typeof clearDiagramOpenErrors;
}

type Props = PropsFromState & PropsFromDispatch;

const DiagramOpenErrorsDialog: React.SFC<Props> = ( { diagramOpenErrors, ...actions } ) =>
{
  function onClose()
  {
    actions.clearDiagramOpenErrors();
  }

  return (
    <Dialog
      open={!!diagramOpenErrors && diagramOpenErrors.length > 0}
      onClose={onClose}
    >
      <DialogTitle>
        Diagram Open Errors
        </DialogTitle>
      <DialogContent>
        <ul>
          {diagramOpenErrors && diagramOpenErrors.map( ( error, i ) => (
            <li key={i}>
              {error}
            </li>
          ) )}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
        >
          Disagree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    diagramOpenErrors: currentEditorState( state ).diagramOpenErrors
  } ),
  {
    clearDiagramOpenErrors
  }
)( DiagramOpenErrorsDialog );
