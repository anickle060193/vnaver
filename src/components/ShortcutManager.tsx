import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { deleteDrawing } from 'store/reducers/drawings';
import { setTool } from 'store/reducers/editor';
import { currentDrawingsState } from 'store/selectors';
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

interface OwnProps
{
  children?: undefined;
}

type Props = PropsFromState & PropsFromDispatch & OwnProps;

const ShortcutManager: React.SFC<Props> = ( {
  selectedDrawingId,
  shortcuts,
  settingsOpen,
  children,
  ...actions
} ) =>
{
  const [ secret, setSecret ] = useState( 0 );

  React.useEffect( () =>
  {
    function updateSecret( newSecret: number )
    {
      if( newSecret === 68
        || ( secret === 68 && newSecret === 69 )
        || ( secret === 69 && newSecret === 86 )
        || ( secret === 86 && newSecret === 84 )
        || ( secret === 84 && newSecret === 79 )
        || ( secret === 79 && newSecret === 79 )
        || ( secret === 79 && newSecret === 76 ) )
      {
        setSecret( newSecret );
      }
      else if( secret === 76 && newSecret === 83 )
      {
        console.log( 'Launching secret...' );
        setSecret( 0 );
        launchSecret();
      }
      else
      {
        setSecret( 0 );
      }
    }

    function onKeyDown( e: KeyboardEvent )
    {
      if( settingsOpen )
      {
        return;
      }

      let target = e.target as HTMLElement;
      if( target.matches( 'input, select, textarea' ) )
      {
        return;
      }

      updateSecret( e.keyCode );

      if( e.key === 'Delete' )
      {
        if( selectedDrawingId )
        {
          actions.deleteDrawing( selectedDrawingId );
        }
      }
      else if( e.key === 'Escape' )
      {
        actions.setTool( Tool.Cursor );
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
          actions.undo();
        }
        else if( shortcut === 'Ctrl+y' )
        {
          actions.redo();
        }
        else
        {
          for( let [ tool, toolShortcut ] of Object.entries( shortcuts ) )
          {
            if( toolShortcut === shortcut )
            {
              actions.setTool( tool as DrawingTool );
            }
          }
        }
      }
    }

    document.addEventListener( 'keydown', onKeyDown );

    return () => document.removeEventListener( 'keydown', onKeyDown );
  }, [ actions, secret, selectedDrawingId, settingsOpen, shortcuts ] );

  return null;
};

export default connect<PropsFromState, PropsFromDispatch, OwnProps, RootState>(
  ( state ) => ( {
    selectedDrawingId: currentDrawingsState( state ).selectedDrawingId,
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
