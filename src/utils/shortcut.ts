import { DrawingTool } from 'utils/draw';

const VALID_KEYS = /^[a-zA-z0-9]$/;

export type ShortcutMap = {[ key in DrawingTool ]: string };

export function getShortcutFromKeyEvent( e: React.KeyboardEvent<HTMLElement> | KeyboardEvent )
{
  let shortcut: string[] = [];
  if( e.ctrlKey )
  {
    shortcut.push( 'Ctrl' );
  }
  if( e.shiftKey )
  {
    shortcut.push( 'Shift' );
  }
  if( e.altKey )
  {
    shortcut.push( 'Alt' );
  }

  if( e.key.match( VALID_KEYS ) )
  {
    shortcut.push( e.key );
  }

  return shortcut.join( '+' );
}
