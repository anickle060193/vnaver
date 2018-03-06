import * as React from 'react';
import { connect } from 'react-redux';

import { setCurrentDocument, swapDocuments, addDocument, closeDocument } from 'store/reducers/documents';
import { DocumentAttributeMap, selectDocumentFilenames, selectDocumentSaveRevisions, selectDocumentCurrentRevision } from 'store/selectors';
import { exit } from 'utils/electron';

import './styles.css';

const FILENAME_SEPARATOR_RE = /[\\\/]/;

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

interface State
{
  draggingDocumentId: string | null;
}

type Props = PropsFromState & PropsFromDispatch;

class DocumentTabs extends React.Component<Props, State>
{
  constructor( props: Props )
  {
    super( props );

    this.state = {
      draggingDocumentId: null
    };
  }

  render()
  {
    let { currentDocumentId, documentFilenames, documentCurrentRevisions, documentSaveRevisions } = this.props;
    let tabCount = this.props.documentIds.length;

    return (
      <ul className="document-tabs">
        {this.props.documentIds.map( ( documentId, i ) =>
        {
          let active = ( documentId === currentDocumentId );
          let filename = documentFilenames[ documentId ] || 'untitled';
          let baseFilename = filename.split( FILENAME_SEPARATOR_RE ).reverse()[ 0 ];

          let modified = ( documentSaveRevisions[ documentId ] !== null || documentCurrentRevisions[ documentId ] !== 0 )
            && documentCurrentRevisions[ documentId ] !== documentSaveRevisions[ documentId ];

          return (
            <li
              key={documentId}
              className={[
                'document-tab',
                active ? 'document-tab-active' : ''
              ].join( ' ' )}
              style={{
                zIndex: active ? tabCount : tabCount - i - 1
              }}
              onMouseDown={( e ) => this.onTabMouseDown( documentId, e )}
              onMouseUp={( e ) => this.onTabMouseUp( documentId, e )}
              draggable={true}
              onDragStart={( e ) => this.onTabDragStart( documentId, e )}
              onDragEnter={( e ) => this.onTabDragEnter( documentId, e )}
              onDragOver={( e ) => this.onTabDragOver( documentId, e )}
              onDragEnd={( e ) => this.onTabDragEnd( documentId, e )}
              title={filename}
            >
              {modified ?
                (
                  <em>{baseFilename} *</em>
                ) : (
                  baseFilename
                )}
            </li>
          );
        } )}
        <li
          className="document-tab new-document-tab"
          onClick={this.onNewTabClick}
        >
          <span className="material-icons">add</span>
        </li>
      </ul>
    );
  }

  private onTabMouseDown = ( documentId: string, e: React.MouseEvent<HTMLLIElement> ) =>
  {
    this.props.setCurrentDocument( documentId );
  }

  private onTabMouseUp = ( documentId: string, e: React.MouseEvent<HTMLLIElement> ) =>
  {
    if( e.button === 1 )
    {
      if( this.props.documentIds.length === 1 )
      {
        exit();
      }
      else
      {
        this.props.closeDocument( documentId );
      }
    }
  }

  private onTabDragStart = ( documentId: string, e: React.DragEvent<HTMLLIElement> ) =>
  {
    this.setState( { draggingDocumentId: documentId } );
  }

  private onTabDragEnter = ( documentId: string, e: React.DragEvent<HTMLLIElement> ) =>
  {
    if( this.state.draggingDocumentId )
    {
      this.props.swapDocuments( [ this.state.draggingDocumentId, documentId ] );
    }
  }

  private onTabDragOver = ( documentId: string, e: React.DragEvent<HTMLLIElement> ) =>
  {
    e.preventDefault();
  }

  private onTabDragEnd = ( documentId: string, e: React.DragEvent<HTMLLIElement> ) =>
  {
    this.setState( { draggingDocumentId: null } );
  }

  private onNewTabClick = () =>
  {
    this.props.addDocument();
  }
}

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
