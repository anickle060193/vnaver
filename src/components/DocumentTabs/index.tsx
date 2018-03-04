import * as React from 'react';
import { connect } from 'react-redux';

import './styles.css';

interface State
{
  activeTab: number;
}

class DocumentTabs extends React.Component<{}, State>
{
  constructor( props: {} )
  {
    super( props );

    this.state = {
      activeTab: 0
    };
  }

  render()
  {
    let tabs = [ 'Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5Tab 5Tab 5Tab 5Tab 5Tab 5' ];

    let tabCount = tabs.length;

    return (
      <ul className="document-tabs">
        {tabs.map( ( tab, i ) => (
          <li
            key={i}
            className={[
              'document-tab',
              i === this.state.activeTab ? 'document-tab-active' : ''
            ].join( ' ' )}
            style={{
              zIndex: i === this.state.activeTab ? tabCount : tabCount - i - 1
            }}
            onClick={() => this.onTabClick( i )}
          >
            {tab}
          </li>
        ) )}
      </ul>
    );
  }

  private onTabClick = ( tabIndex: number ) =>
  {
    this.setState( { activeTab: tabIndex } );
  }
}

export default connect<{}, {}, {}, RootState>(
  ( state ) => ( {} ),
  {
  }
)( DocumentTabs );
