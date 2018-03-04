import * as React from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { deleteDrawing } from 'store/reducers/drawings';
import { setTool } from 'store/reducers/editor';
import { stateDrawings } from 'store/selectors';
import { DrawingTool, Tool } from 'utils/draw';
import { getShortcutFromKeyEvent, ShortcutMap } from 'utils/shortcut';
import { launchSecret } from 'utils/electron';

interface PropsFromState
{
  selectedDrawingId: string | null;
  shortcuts: ShortcutMap;
  settingsOpen: boolean;
}

interface PropsFromDispatch
{
  setTool: typeof setTool;
  deleteDrawing: typeof deleteDrawing;
  undo: typeof ActionCreators.undo;
  redo: typeof ActionCreators.redo;
}

type Props = PropsFromState & PropsFromDispatch;

interface State
{
  secret: number;
}

class ShortcutManager extends React.Component<Props, State>
{
  constructor( props: Props )
  {
    super( props );

    this.state = {
      secret: 0
    };
  }

  componentDidMount()
  {
    document.addEventListener( 'keydown', this.onKeyDown );
  }

  componentWillUnmount()
  {
    document.removeEventListener( 'keydown', this.onKeyDown );
  }

  render()
  {
    return this.props.children;
  }

  private onKeyDown = ( e: KeyboardEvent ) =>
  {
    if( this.props.settingsOpen )
    {
      return;
    }

    let target = e.target as HTMLElement;
    if( target.matches( 'input, select, textarea' ) )
    {
      return;
    }

    this.updateSecret( e.keyCode );

    if( e.key === 'Delete' )
    {
      if( this.props.selectedDrawingId )
      {
        this.props.deleteDrawing( this.props.selectedDrawingId );
      }
    }
    else if( e.key === 'Escape' )
    {
      this.props.setTool( Tool.Cursor );
    }
    else
    {
      let shortcut = getShortcutFromKeyEvent( e );

      if( !shortcut )
      {
        return;
      }

      if( shortcut === 'Ctrl+z' )
      {
        this.props.undo();
      }
      else if( shortcut === 'Ctrl+y' )
      {
        this.props.redo();
      }
      else
      {
        for( let [ tool, toolShortcut ] of Object.entries( this.props.shortcuts ) )
        {
          if( toolShortcut === shortcut )
          {
            this.props.setTool( tool as DrawingTool );
          }
        }
      }
    }
  }

  private updateSecret( secret: number )
  {
    if( secret === 68
      || this.state.secret === 68 && secret === 69
      || this.state.secret === 69 && secret === 86
      || this.state.secret === 86 && secret === 84
      || this.state.secret === 84 && secret === 79
      || this.state.secret === 79 && secret === 79
      || this.state.secret === 79 && secret === 76 )
    {
      this.setState( { secret } );
    }
    else if( this.state.secret === 76 && secret === 83 )
    {
      this.setState( { secret: 0 } );
      launchSecret();
    }
    else
    {
      this.setState( { secret: 0 } );
    }
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    selectedDrawingId: stateDrawings( state ).selectedDrawingId,
    shortcuts: state.settings.shortcuts,
    settingsOpen: state.settings.show
  } ),
  {
    setTool,
    deleteDrawing,
    undo: ActionCreators.undo,
    redo: ActionCreators.redo
  }
)( ShortcutManager );
