import { DrawingTool, Tool, DrawingType } from 'utils/draw';

const SHORTCUT_PREFIX = 'shortcuts';

function k( ...subkeys: string[] )
{
  return 'settings.' + subkeys.join( '.' );
}

function getItem<T>( key: string, defaultValue: T )
{
  let s = localStorage.getItem( key );
  if( s )
  {
    return JSON.parse( s ) as T;
  }
  else
  {
    return defaultValue;
  }
}

function setItem<T>( key: string, value: T )
{
  localStorage.setItem( key, JSON.stringify( value ) );
}

export function getShortcut( tool: DrawingTool )
{
  return getItem<string>( k( SHORTCUT_PREFIX, tool ), '' );
}

export function getAllShortcuts(): {[ key in DrawingTool ]: string }
{
  return {
    [ Tool.Cursor ]: getItem( k( SHORTCUT_PREFIX, Tool.Cursor ), '' ),
    [ DrawingType.Above ]: getItem( k( SHORTCUT_PREFIX, DrawingType.Above ), '' ),
    [ DrawingType.At ]: getItem( k( SHORTCUT_PREFIX, DrawingType.At ), '' ),
    [ DrawingType.Below ]: getItem( k( SHORTCUT_PREFIX, DrawingType.Below ), '' ),
    [ DrawingType.Between ]: getItem( k( SHORTCUT_PREFIX, DrawingType.Between ), '' ),
    [ DrawingType.PathLine ]: getItem( k( SHORTCUT_PREFIX, DrawingType.PathLine ), '' ),
    [ DrawingType.VerticalGridLine ]: getItem( k( SHORTCUT_PREFIX, DrawingType.VerticalGridLine ), '' ),
    [ DrawingType.HorizontalGridLine ]: getItem( k( SHORTCUT_PREFIX, DrawingType.HorizontalGridLine ), '' )
  };
}

export function setShortcut( tool: DrawingTool, shortcut: string )
{
  return setItem( k( SHORTCUT_PREFIX, tool ), shortcut );
}
