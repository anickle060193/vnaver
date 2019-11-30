import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { makeStyles, createStyles, colors, IconButton, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

import { setCurrentDocument, swapDocuments, addDocument, closeDocument } from 'store/reducers/documents';
import { DocumentAttributeMap, selectDocumentFilenames, selectDocumentSaveRevisions, selectDocumentCurrentRevision } from 'store/selectors';

import { exit } from 'utils/electron';

const FILENAME_SEPARATOR_RE = /[\\/]/;

const stopEvent = ( e: React.SyntheticEvent ) => e.stopPropagation();

const useStyles = makeStyles( ( theme ) => createStyles( {
  tabs: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: '1px solid lightgray',
  },
  tab: {
    flex: 1,
    minWidth: 0,
    maxWidth: '15rem',
    height: '2rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing( 0.25, 1.0 ),
    marginBottom: -1,
    border: '1px solid lightgray',
    borderLeft: 'none',
    transition: theme.transitions.create( 'background-color', { duration: 250 } ),
    backgroundColor: 'rgb( 238, 238, 238 )',
    '&:hover': {
      backgroundColor: 'rgb( 245, 245, 245 )',
    },
  },
  activeTab: {
    backgroundColor: 'white',
    borderBottom: '1px solid transparent',
  },
  filename: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  modified: {
    fontStyle: 'italic',
    '&:after': {
      content: '"*"',
    },
  },
  closeTab: {
    padding: 0,
    '&:hover': {
      backgroundColor: colors.red[ 500 ],
      color: theme.palette.getContrastText( colors.red[ 500 ] ),
    },
  },
  newTabButton: {
    margin: theme.spacing( 0, 1 ),
  },
} ) );

interface PropsFromState
{
  documentIds: string[];
  currentDocumentId: string;
  documentFilenames: DocumentAttributeMap<string | null>;
  documentSaveRevisions: DocumentAttributeMap<number | null>;
  documentCurrentRevisions: DocumentAttributeMap<number>;
}

interface PropsFromDispatch
{
  setCurrentDocument: typeof setCurrentDocument;
  swapDocuments: typeof swapDocuments;
  addDocument: typeof addDocument;
  closeDocument: typeof closeDocument;
}

type Props = PropsFromState & PropsFromDispatch;

const DocumentTabs: React.SFC<Props> = ( {
  documentIds,
  currentDocumentId,
  documentFilenames,
  documentSaveRevisions,
  documentCurrentRevisions,
  ...actions
} ) =>
{
  const styles = useStyles();

  const [ draggingDocumentId, setDraggingDocumentId ] = React.useState<string | null>( null );

  function onCloseDocument( documentId: string )
  {
    if( documentIds.length === 1 )
    {
      exit();
    }
    else
    {
      actions.closeDocument( documentId );
    }
  }

  function onTabClick( documentId: string, e: React.MouseEvent<HTMLElement> )
  {
    if( e.button === 1 )
    {
      onCloseDocument( documentId );
    }
    else
    {
      actions.setCurrentDocument( documentId );
    }
  }

  function onCloseTabClick( documentId: string, e: React.MouseEvent<HTMLElement> )
  {
    e.stopPropagation();

    onCloseDocument( documentId );
  }

  function onTabDragStart( documentId: string, e: React.DragEvent<HTMLElement> )
  {
    setDraggingDocumentId( documentId );
  }

  function onTabDragEnter( documentId: string, e: React.DragEvent<HTMLElement> )
  {
    if( draggingDocumentId )
    {
      actions.swapDocuments( [ draggingDocumentId, documentId ] );
    }
  }

  function onTabDragOver( documentId: string, e: React.DragEvent<HTMLElement> )
  {
    e.preventDefault();
  }

  function onTabDragEnd( documentId: string, e: React.DragEvent<HTMLElement> )
  {
    setDraggingDocumentId( null );
  }

  function onNewTabClick()
  {
    actions.addDocument();
  }

  return (
    <div className={styles.tabs}>
      {documentIds.map( ( documentId, i ) =>
      {
        let active = ( documentId === currentDocumentId );
        let filename = documentFilenames[ documentId ] || 'untitled';
        let baseFilename = filename.split( FILENAME_SEPARATOR_RE ).reverse()[ 0 ];

        let modified = ( documentSaveRevisions[ documentId ] !== null || documentCurrentRevisions[ documentId ] !== 0 )
          && documentCurrentRevisions[ documentId ] !== documentSaveRevisions[ documentId ];

        return (
          <div
            key={documentId}
            className={classNames( styles.tab, active && styles.activeTab )}
            style={{
              zIndex: active ? documentIds.length : documentIds.length - i - 1
            }}
            onClick={( e ) => onTabClick( documentId, e )}
            draggable={true}
            onDragStart={( e ) => onTabDragStart( documentId, e )}
            onDragEnter={( e ) => onTabDragEnter( documentId, e )}
            onDragOver={( e ) => onTabDragOver( documentId, e )}
            onDragEnd={( e ) => onTabDragEnd( documentId, e )}
          >
            <Tooltip title={filename} enterDelay={1000}>
              <span
                className={classNames( styles.filename, modified && styles.modified )}
              >
                {baseFilename}
              </span>
            </Tooltip>
            <Tooltip title="Close" enterDelay={1000}>
              <IconButton
                size="small"
                className={styles.closeTab}
                onMouseDown={stopEvent}
                onClick={( e ) => onCloseTabClick( documentId, e )}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        );
      } )}
      <Tooltip title="New Tab">
        <IconButton
          className={styles.newTabButton}
          size="small"
          onClick={onNewTabClick}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    documentIds: state.documents.order,
    currentDocumentId: state.documents.currentDocumentId,
    documentFilenames: selectDocumentFilenames( state ),
    documentSaveRevisions: selectDocumentSaveRevisions( state ),
    documentCurrentRevisions: selectDocumentCurrentRevision( state )
  } ),
  {
    setCurrentDocument,
    swapDocuments,
    addDocument,
    closeDocument
  }
)( DocumentTabs );
