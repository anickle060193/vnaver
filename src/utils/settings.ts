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
    [ Tool.Cursor ]: getShortcut( Tool.Cursor ),
    [ DrawingType.Above ]: getShortcut( DrawingType.Above ),
    [ DrawingType.At ]: getShortcut( DrawingType.At ),
    [ DrawingType.Below ]: getShortcut( DrawingType.Below ),
    [ DrawingType.Between ]: getShortcut( DrawingType.Between ),
    [ DrawingType.PathLine ]: getShortcut( DrawingType.PathLine ),
    [ DrawingType.VerticalGridLine ]: getShortcut( DrawingType.VerticalGridLine ),
    [ DrawingType.HorizontalGridLine ]: getShortcut( DrawingType.HorizontalGridLine ),
    [ DrawingType.Plane ]: getShortcut( DrawingType.Plane )
  };
}

export function setShortcut( tool: DrawingTool, shortcut: string )
{
  return setItem( k( SHORTCUT_PREFIX, tool ), shortcut );
}
