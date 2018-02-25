import * as Ajv from 'ajv';

import { DrawingTool, Tool, DrawingType, DrawingTypeMap } from 'utils/draw';
import { ShortcutMap } from 'utils/shortcut';

const ajv = new Ajv( { allErrors: true } )
  .addSchema( { type: 'string' }, 'string' )
  .addSchema( { type: 'boolean' }, 'boolean' )
  .addSchema( { type: 'number' }, 'number' )
  .addFormat( 'color', /^#[0-9a-fA-F]{6}/ )
  .addSchema( { type: 'string', format: 'color' }, 'color' )
  .addFormat( 'shortcut', /^((Ctrl\+)?(Shift\+)?(Alt\+)?[a-zA-Z0-9])?$/ )
  .addSchema( { type: 'string', format: 'shortcut' }, 'shortcut' );

const SHORTCUT_PREFIX = 'shortcuts';
const GRID_ON_PREFIX = 'grid_on';
const DEFAULT_DRAWING_COLOR_PREFIX = 'default_color';

function k( ...subkeys: string[] )
{
  return 'settings.' + subkeys.join( '.' );
}

function setItem<T>( key: string, value: T )
{
  localStorage.setItem( key, JSON.stringify( value ) );
}

function getValidItem<T>( key: string, schema: string, defaultValue: T )
{
  let s = localStorage.getItem( key );
  if( s )
  {
    let value = null;
    try
    {
      value = JSON.parse( s );
    }
    catch( e )
    {
      console.warn( 'Failed to parse setting:', key, s );
    }
    if( ajv.validate( schema, value ) )
    {
      return value;
    }
    else
    {
      console.warn( 'Unexpected setting value:', key, value, ajv.errorsText() );
    }
  }
  return defaultValue;
}

// function getString( key: string, defaultValue: string )
// {
//   return getValidItem( key, 'string', defaultValue );
// }

function getBoolean( key: string, defautlValue: boolean )
{
  return getValidItem( key, 'boolean', defautlValue );
}

function getColor( key: string, defaultValue: string )
{
  return getValidItem( key, 'color', defaultValue );
}

export function setShortcutSetting( tool: DrawingTool, shortcut: string )
{
  return setItem( k( SHORTCUT_PREFIX, tool ), shortcut );
}

export function getShortcutSetting( tool: DrawingTool )
{
  return getValidItem( k( SHORTCUT_PREFIX, tool ), 'shortcut', '' );
}

export function getAllShortcutSettings(): ShortcutMap
{
  return {
    [ Tool.Cursor ]: getShortcutSetting( Tool.Cursor ),
    [ DrawingType.Above ]: getShortcutSetting( DrawingType.Above ),
    [ DrawingType.At ]: getShortcutSetting( DrawingType.At ),
    [ DrawingType.Below ]: getShortcutSetting( DrawingType.Below ),
    [ DrawingType.Between ]: getShortcutSetting( DrawingType.Between ),
    [ DrawingType.PathLine ]: getShortcutSetting( DrawingType.PathLine ),
    [ DrawingType.VerticalGridLine ]: getShortcutSetting( DrawingType.VerticalGridLine ),
    [ DrawingType.HorizontalGridLine ]: getShortcutSetting( DrawingType.HorizontalGridLine ),
    [ DrawingType.Plane ]: getShortcutSetting( DrawingType.Plane )
  };
}

export function setDefaultDrawingColorSetting( drawingType: DrawingType, color: string )
{
  return setItem( k( DEFAULT_DRAWING_COLOR_PREFIX, drawingType ), color );
}

export function getDefaultDrawingColorSetting( drawingType: DrawingType )
{
  return getColor( k( DEFAULT_DRAWING_COLOR_PREFIX, drawingType ), '#000000' );
}

export function getAllDefaultDrawingColorSettings(): DrawingTypeMap<string>
{
  return {
    [ DrawingType.Above ]: getDefaultDrawingColorSetting( DrawingType.Above ),
    [ DrawingType.At ]: getDefaultDrawingColorSetting( DrawingType.At ),
    [ DrawingType.Below ]: getDefaultDrawingColorSetting( DrawingType.Below ),
    [ DrawingType.Between ]: getDefaultDrawingColorSetting( DrawingType.Between ),
    [ DrawingType.PathLine ]: getDefaultDrawingColorSetting( DrawingType.PathLine ),
    [ DrawingType.VerticalGridLine ]: getDefaultDrawingColorSetting( DrawingType.VerticalGridLine ),
    [ DrawingType.HorizontalGridLine ]: getDefaultDrawingColorSetting( DrawingType.HorizontalGridLine ),
    [ DrawingType.Plane ]: getDefaultDrawingColorSetting( DrawingType.Plane )
  };
}

export function setGridOnSetting( gridOn: boolean )
{
  setItem( k( GRID_ON_PREFIX ), gridOn );
}

export function getGridOnSetting()
{
  return getBoolean( k( GRID_ON_PREFIX ), true );
}

export function setGridIntervalXSetting( gridIntervalX: number )
{
  setItem( k( 'grid_interval_x' ), gridIntervalX );
}

export function getGridIntervalXSetting()
{
  return getValidItem( k( 'grid_interval_x' ), 'number', 50 );
}

export function setGridIntervalYSetting( gridIntervalX: number )
{
  setItem( k( 'grid_interval_y' ), gridIntervalX );
}

export function getGridIntervalYSetting()
{
  return getValidItem( k( 'grid_interval_y' ), 'number', 50 );
}

export function setSnapToGridSetting( snapToGrid: boolean )
{
  setItem( k( 'snap_to_grid' ), snapToGrid );
}

export function getSnapToGridSetting()
{
  return getValidItem( k( 'snap_to_grid' ), 'boolean', true );
}
