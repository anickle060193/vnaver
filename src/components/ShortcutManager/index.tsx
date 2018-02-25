import * as React from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { deleteDrawing } from 'store/reducers/drawings';
import { setTool } from 'store/reducers/editor';
import { DrawingTool, Tool } from 'utils/draw';
import { getShortcutFromKeyEvent, ShortcutMap } from 'utils/shortcut';

interface PropsFromState
{
  selectedDrawingId: string | null;
  shortcuts: ShortcutMap;
}

interface PropsFromDispatch
{
  setTool: typeof setTool;
  deleteDrawing: typeof deleteDrawing;
  undo: typeof ActionCreators.undo;
  redo: typeof ActionCreators.redo;
}

type Props = PropsFromState & PropsFromDispatch;

class ShortcutManager extends React.Component<Props>
{
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
    let target = e.target as HTMLElement;
    if( target.matches( 'input' ) )
    {
      return;
    }

    let shortcut = getShortcutFromKeyEvent( e );

    if( shortcut === 'Ctrl+z' )
    {
      this.props.undo();
    }
    else if( shortcut === 'Ctrl+y' )
    {
      this.props.redo();
    }
    else if( e.key === 'Delete' )
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

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    selectedDrawingId: state.drawings.present.selectedDrawingId,
    shortcuts: state.settings.shortcuts
  } ),
  {
    setTool,
    deleteDrawing,
    undo: ActionCreators.undo,
    redo: ActionCreators.redo
  }
)( ShortcutManager );
