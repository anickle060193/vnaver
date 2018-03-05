import * as React from 'react';
import { connect } from 'react-redux';

import { setCurrentDocument, swapDocuments, addDocument } from 'store/reducers/documents';
import { documentNames, documentModifieds, DocumentAttributeMap } from 'store/selectors';

import './styles.css';

interface PropsFromState
{
  documentIds: string[];
  currentDocumentId: string;
  documentNames: DocumentAttributeMap<string>;
  documentModifieds: DocumentAttributeMap<boolean>;
}

interface PropsFromDispatch
{
  setCurrentDocument: typeof setCurrentDocument;
  swapDocuments: typeof swapDocuments;
  addDocument: typeof addDocument;
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
    let tabCount = this.props.documentIds.length;

    return (
      <ul className="document-tabs">
        {this.props.documentIds.map( ( documentId, i ) => (
          <li
            key={documentId}
            className={[
              'document-tab',
              documentId === this.props.currentDocumentId ? 'document-tab-active' : ''
            ].join( ' ' )}
            style={{
              zIndex: documentId === this.props.currentDocumentId ? tabCount : tabCount - i - 1
            }}
            onMouseDown={() => this.onMouseDown( documentId )}
            draggable={true}
            onDragStart={( e ) => this.onDragStart( documentId, e )}
            onDragEnter={( e ) => this.onDragEnter( documentId, e )}
            onDragOver={( e ) => this.onDragOver( documentId, e )}
            onDragEnd={( e ) => this.onDragEnd( documentId, e )}
          >
            {this.props.documentModifieds[ documentId ] ?
              (
                <em>{this.props.documentNames[ documentId ]} *</em>
              ) : (
                this.props.documentNames[ documentId ]
              )}
          </li>
        ) )}
        <li
          className="document-tab new-document-tab"
          onClick={this.onNewTabClick}
        >
          <span className="material-icons">add</span>
        </li>
      </ul>
    );
  }

  private onMouseDown = ( documentId: string ) =>
  {
    this.props.setCurrentDocument( documentId );
  }

  private onDragStart = ( documentId: string, e: React.DragEvent<HTMLLIElement> ) =>
  {
    this.setState( { draggingDocumentId: documentId } );
  }

  private onDragEnter = ( documentId: string, e: React.DragEvent<HTMLLIElement> ) =>
  {
    if( this.state.draggingDocumentId )
    {
      this.props.swapDocuments( [ this.state.draggingDocumentId, documentId ] );
    }
  }

  private onDragOver = ( documentId: string, e: React.DragEvent<HTMLLIElement> ) =>
  {
    e.preventDefault();
  }

  private onDragEnd = ( documentId: string, e: React.DragEvent<HTMLLIElement> ) =>
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
    documentNames: documentNames( state ),
    documentModifieds: documentModifieds( state )
  } ),
  {
    setCurrentDocument,
    swapDocuments,
    addDocument
  }
)( DocumentTabs );
