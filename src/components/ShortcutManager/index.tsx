import * as React from 'react';
import { connect } from 'react-redux';

import { deleteDrawing, setTool } from 'store/reducers/drawing';
import { DrawingTool, Tool } from 'utils/draw';
import { getAllShortcuts } from 'utils/settings';

interface PropsFromState
{
  selectedDrawingId: string | null;
}

interface PropsFromDispatch
{
  setTool: typeof setTool;
  deleteDrawing: typeof deleteDrawing;
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
      for( let [ tool, shortcut ] of Object.entries( getAllShortcuts() ) )
      {
        if( shortcut === e.key )
        {
          this.props.setTool( tool as DrawingTool );
        }
      }
    }
  }
}

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    selectedDrawingId: state.drawing.selectedDrawingId
  } ),
  {
    setTool,
    deleteDrawing
  }
)( ShortcutManager );
