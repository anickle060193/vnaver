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

class Settings
{
  setShortcutSetting( tool: DrawingTool, shortcut: string )
  {
    setItem( k( SHORTCUT_PREFIX, tool ), shortcut );
  }

  getShortcutSetting( tool: DrawingTool )
  {
    return getValidItem( k( SHORTCUT_PREFIX, tool ), 'shortcut', '' );
  }

  getAllShortcutSettings(): ShortcutMap
  {
    return {
      [ Tool.Cursor ]: this.getShortcutSetting( Tool.Cursor ),
      [ DrawingType.Above ]: this.getShortcutSetting( DrawingType.Above ),
      [ DrawingType.At ]: this.getShortcutSetting( DrawingType.At ),
      [ DrawingType.Below ]: this.getShortcutSetting( DrawingType.Below ),
      [ DrawingType.Between ]: this.getShortcutSetting( DrawingType.Between ),
      [ DrawingType.PathLine ]: this.getShortcutSetting( DrawingType.PathLine ),
      [ DrawingType.VerticalGridLine ]: this.getShortcutSetting( DrawingType.VerticalGridLine ),
      [ DrawingType.HorizontalGridLine ]: this.getShortcutSetting( DrawingType.HorizontalGridLine ),
      [ DrawingType.Plane ]: this.getShortcutSetting( DrawingType.Plane ),
      [ DrawingType.Text ]: this.getShortcutSetting( DrawingType.Text )
    };
  }

  setDefaultDrawingColorSetting( drawingType: DrawingType, color: string )
  {
    setItem( k( DEFAULT_DRAWING_COLOR_PREFIX, drawingType ), color );
  }

  getDefaultDrawingColorSetting( drawingType: DrawingType )
  {
    return getColor( k( DEFAULT_DRAWING_COLOR_PREFIX, drawingType ), '#000000' );
  }

  getAllDefaultDrawingColorSettings(): DrawingTypeMap<string>
  {
    return {
      [ DrawingType.Above ]: this.getDefaultDrawingColorSetting( DrawingType.Above ),
      [ DrawingType.At ]: this.getDefaultDrawingColorSetting( DrawingType.At ),
      [ DrawingType.Below ]: this.getDefaultDrawingColorSetting( DrawingType.Below ),
      [ DrawingType.Between ]: this.getDefaultDrawingColorSetting( DrawingType.Between ),
      [ DrawingType.PathLine ]: this.getDefaultDrawingColorSetting( DrawingType.PathLine ),
      [ DrawingType.VerticalGridLine ]: this.getDefaultDrawingColorSetting( DrawingType.VerticalGridLine ),
      [ DrawingType.HorizontalGridLine ]: this.getDefaultDrawingColorSetting( DrawingType.HorizontalGridLine ),
      [ DrawingType.Plane ]: this.getDefaultDrawingColorSetting( DrawingType.Plane ),
      [ DrawingType.Text ]: this.getDefaultDrawingColorSetting( DrawingType.Text )
    };
  }

  setDeselectAfterAdd( drawingType: DrawingType, deselectAfterAdd: boolean )
  {
    setItem( k( 'deselect_after_add', drawingType ), deselectAfterAdd );
  }

  getDeselectToolAfterAdd( drawingType: DrawingType )
  {
    return getValidItem( k( 'clear_tool_after_add', drawingType ), 'boolean', true );
  }

  getAllDeselectToolAfterAdd(): DrawingTypeMap<boolean>
  {
    return {
      [ DrawingType.Above ]: this.getDeselectToolAfterAdd( DrawingType.Above ),
      [ DrawingType.At ]: this.getDeselectToolAfterAdd( DrawingType.At ),
      [ DrawingType.Below ]: this.getDeselectToolAfterAdd( DrawingType.Below ),
      [ DrawingType.Between ]: this.getDeselectToolAfterAdd( DrawingType.Between ),
      [ DrawingType.PathLine ]: this.getDeselectToolAfterAdd( DrawingType.PathLine ),
      [ DrawingType.VerticalGridLine ]: this.getDeselectToolAfterAdd( DrawingType.VerticalGridLine ),
      [ DrawingType.HorizontalGridLine ]: this.getDeselectToolAfterAdd( DrawingType.HorizontalGridLine ),
      [ DrawingType.Plane ]: this.getDeselectToolAfterAdd( DrawingType.Plane ),
      [ DrawingType.Text ]: this.getDeselectToolAfterAdd( DrawingType.Text )
    };
  }

  set gridOn( gridOn: boolean )
  {
    setItem( k( GRID_ON_PREFIX ), gridOn );
  }

  get gridOn()
  {
    return getBoolean( k( GRID_ON_PREFIX ), true );
  }

  set gridIntervalX( gridIntervalX: number )
  {
    setItem( k( 'grid_interval_x' ), gridIntervalX );
  }

  get gridIntervalX()
  {
    return getValidItem( k( 'grid_interval_x' ), 'number', 50 );
  }

  set gridIntervalY( gridIntervalX: number )
  {
    setItem( k( 'grid_interval_y' ), gridIntervalX );
  }

  get gridIntervalY()
  {
    return getValidItem( k( 'grid_interval_y' ), 'number', 50 );
  }

  set snapToGrid( snapToGrid: boolean )
  {
    setItem( k( 'snap_to_grid' ), snapToGrid );
  }

  get snapToGrid()
  {
    return getValidItem( k( 'snap_to_grid' ), 'boolean', true );
  }
}

const settings = new Settings();
export default settings;
