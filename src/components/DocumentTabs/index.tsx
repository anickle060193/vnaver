import * as React from 'react';
import { connect } from 'react-redux';

import './styles.css';

interface State
{
  tabs: string[];
  activeTab: number;
  dragging: number | null;
}

class DocumentTabs extends React.Component<{}, State>
{
  constructor( props: {} )
  {
    super( props );

    this.state = {
      tabs: [ 'Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5Tab 5Tab 5Tab 5Tab 5Tab 5' ],
      activeTab: 0,
      dragging: null
    };
  }

  render()
  {
    let tabCount = this.state.tabs.length;

    return (
      <ul className="document-tabs">
        {this.state.tabs.map( ( tab, i ) => (
          <li
            key={i}
            className={[
              'document-tab',
              i === this.state.activeTab ? 'document-tab-active' : ''
            ].join( ' ' )}
            style={{
              zIndex: i === this.state.activeTab ? tabCount : tabCount - i - 1
            }}
            onMouseDown={() => this.onMouseDown( i )}
            draggable={true}
            onDragStart={( e ) => this.onDragStart( i, e )}
            onDragEnter={( e ) => this.onDragEnter( i, e )}
            onDragOver={( e ) => this.onDragOver( i, e )}
            onDragEnd={( e ) => this.onDragEnd( i, e )}
          >
            {tab}
          </li>
        ) )}
      </ul>
    );
  }

  private onMouseDown = ( tabIndex: number ) =>
  {
    this.setState( { activeTab: tabIndex } );
  }

  private onDragStart = ( tabIndex: number, e: React.DragEvent<HTMLLIElement> ) =>
  {
    this.setState( { dragging: tabIndex } );
  }

  private onDragEnter = ( tabIndex: number, e: React.DragEvent<HTMLLIElement> ) =>
  {
    this.dragTab( tabIndex );
  }

  private onDragOver = ( tabIndex: number, e: React.DragEvent<HTMLLIElement> ) =>
  {
    e.preventDefault();
  }

  private onDragEnd = ( tabIndex: number, e: React.DragEvent<HTMLLIElement> ) =>
  {
    this.setState( { dragging: null } );
  }

  private dragTab( tabIndex: number )
  {
    this.setState( ( prevState ) =>
    {
      if( prevState.dragging !== null && prevState.dragging !== tabIndex )
      {
        let newTabs = [ ...prevState.tabs ];
        let a = newTabs[ prevState.dragging ];
        newTabs[ prevState.dragging ] = newTabs[ tabIndex ];
        newTabs[ tabIndex ] = a;
        return { tabs: newTabs, dragging: tabIndex, activeTab: tabIndex };
      }
      else
      {
        return { ...prevState };
      }
    } );
  }
}

export default connect<{}, {}, {}, RootState>(
  ( state ) => ( {} ),
  {
  }
)( DocumentTabs );
