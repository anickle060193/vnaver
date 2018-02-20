import * as React from 'react';
import { connect } from 'react-redux';

import { deleteDrawing, setTool } from 'store/reducers/drawing';
import { Drawing, DrawingTool, Tool } from 'utils/draw';
import { shortcuts } from 'utils/settings';

interface PropsFromState
{
  selectedDrawing: Drawing | null;
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
    if( e.key === 'Delete' )
    {
      if( this.props.selectedDrawing )
      {
        this.props.deleteDrawing( this.props.selectedDrawing );
      }
    }
    else if( e.key === 'Escape' )
    {
      this.props.setTool( Tool.Cursor );
    }
    else
    {
      for( let [ tool, shortcut ] of Object.entries( shortcuts ) )
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
    selectedDrawing: state.drawing.selectedDrawing
  } ),
  {
    setTool,
    deleteDrawing
  }
)( ShortcutManager );
