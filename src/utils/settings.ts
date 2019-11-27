import Ajv from 'ajv';

import { DrawingTool, Tool, DrawingType, DrawingTypeMap } from 'utils/draw';
import { ShortcutMap } from 'utils/shortcut';

enum SettingKey
{
  Shortcut = 'shortcuts',
  DefaultDrawingColor = 'default_color',
  DeselectToolAfterAdd = 'deselect_tool_after_add',
  GridOn = 'grid_on',
  GridIntervalX = 'grid_interval_x',
  GridIntervalY = 'grid_interval_y',
  SnapToGrid = 'snap_to_grid',
  TransparentDrawingProperties = 'transparent_drawing_properties',
  AutoHideToolbar = 'auto_hide_toolbar'
}

function k( ...subkeys: Array<SettingKey | DrawingTool> )
{
  return 'settings.' + subkeys.join( '.' );
}

enum SettingType
{
  String = 'String',
  Boolean = 'Boolean',
  Color = 'Color',
  Shortcut = 'Shortcut',
  GridInterval = 'GridInterval'
}

const ajv = new Ajv( { allErrors: true } )
  .addSchema( { type: 'string' }, SettingType.String )
  .addSchema( { type: 'boolean' }, SettingType.Boolean )
  .addFormat( 'format.color', /^#[0-9a-fA-F]{6}/ )
  .addSchema( { type: 'string', format: 'format.color' }, SettingType.Color )
  .addFormat( 'format.shortcut', /^((Ctrl\+)?(Shift\+)?(Alt\+)?[a-zA-Z0-9])?$/ )
  .addSchema( { type: 'string', format: 'format.shortcut' }, SettingType.Shortcut )
  .addSchema( { type: 'number', minimum: 1, maximum: 10000 }, SettingType.GridInterval );

function setValidItem<T>( key: string, settingType: SettingType, value: T )
{
  if( ajv.validate( settingType, value ) )
  {
    localStorage.setItem( key, JSON.stringify( value ) );
  }
}

function getValidItem<T>( key: string, settingType: SettingType, defaultValue: T )
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
    if( ajv.validate( settingType, value ) )
    {
      return value;
    }
    else
    {
      console.warn( 'Unexpected setting value:', key, value, ajv.errorsText() );
    }
  }
  if( !ajv.validate( settingType, defaultValue ) )
  {
    throw new Error( `Invalid value of type - ${settingType} : ${defaultValue}` );
  }
  return defaultValue;
}

class Settings
{
  public setShortcutSetting( tool: DrawingTool, shortcut: string )
  {
    setValidItem( k( SettingKey.Shortcut, tool ), SettingType.Shortcut, shortcut );
  }

  public getShortcutSetting( tool: DrawingTool )
  {
    return getValidItem( k( SettingKey.Shortcut, tool ), SettingType.Shortcut, '' );
  }

  public getAllShortcutSettings(): ShortcutMap
  {
    return {
      [ Tool.Cursor ]: this.getShortcutSetting( Tool.Cursor ),
      [ DrawingType.Above ]: this.getShortcutSetting( DrawingType.Above ),
      [ DrawingType.At ]: this.getShortcutSetting( DrawingType.At ),
      [ DrawingType.Below ]: this.getShortcutSetting( DrawingType.Below ),
      [ DrawingType.Between ]: this.getShortcutSetting( DrawingType.Between ),
      [ DrawingType.PathLine ]: this.getShortcutSetting( DrawingType.PathLine ),
      [ DrawingType.CurvedLine ]: this.getShortcutSetting( DrawingType.CurvedLine ),
      [ DrawingType.VerticalGridLine ]: this.getShortcutSetting( DrawingType.VerticalGridLine ),
      [ DrawingType.HorizontalGridLine ]: this.getShortcutSetting( DrawingType.HorizontalGridLine ),
      [ DrawingType.Plane ]: this.getShortcutSetting( DrawingType.Plane ),
      [ DrawingType.Text ]: this.getShortcutSetting( DrawingType.Text )
    };
  }

  public setDefaultDrawingColorSetting( drawingType: DrawingType, color: string )
  {
    setValidItem( k( SettingKey.DefaultDrawingColor, drawingType ), SettingType.Color, color );
  }

  public getDefaultDrawingColorSetting( drawingType: DrawingType )
  {
    return getValidItem( k( SettingKey.DefaultDrawingColor, drawingType ), SettingType.Color, '#000000' );
  }

  public getAllDefaultDrawingColorSettings(): DrawingTypeMap<string>
  {
    return {
      [ DrawingType.Above ]: this.getDefaultDrawingColorSetting( DrawingType.Above ),
      [ DrawingType.At ]: this.getDefaultDrawingColorSetting( DrawingType.At ),
      [ DrawingType.Below ]: this.getDefaultDrawingColorSetting( DrawingType.Below ),
      [ DrawingType.Between ]: this.getDefaultDrawingColorSetting( DrawingType.Between ),
      [ DrawingType.PathLine ]: this.getDefaultDrawingColorSetting( DrawingType.PathLine ),
      [ DrawingType.CurvedLine ]: this.getDefaultDrawingColorSetting( DrawingType.CurvedLine ),
      [ DrawingType.VerticalGridLine ]: this.getDefaultDrawingColorSetting( DrawingType.VerticalGridLine ),
      [ DrawingType.HorizontalGridLine ]: this.getDefaultDrawingColorSetting( DrawingType.HorizontalGridLine ),
      [ DrawingType.Plane ]: this.getDefaultDrawingColorSetting( DrawingType.Plane ),
      [ DrawingType.Text ]: this.getDefaultDrawingColorSetting( DrawingType.Text )
    };
  }

  public setDeselectToolAfterAdd( drawingType: DrawingType, deselectAfterAdd: boolean )
  {
    setValidItem( k( SettingKey.DeselectToolAfterAdd, drawingType ), SettingType.Boolean, deselectAfterAdd );
  }

  public getDeselectToolAfterAdd( drawingType: DrawingType )
  {
    return getValidItem( k( SettingKey.DeselectToolAfterAdd, drawingType ), SettingType.Boolean, true );
  }

  public getAllDeselectToolAfterAdd(): DrawingTypeMap<boolean>
  {
    return {
      [ DrawingType.Above ]: this.getDeselectToolAfterAdd( DrawingType.Above ),
      [ DrawingType.At ]: this.getDeselectToolAfterAdd( DrawingType.At ),
      [ DrawingType.Below ]: this.getDeselectToolAfterAdd( DrawingType.Below ),
      [ DrawingType.Between ]: this.getDeselectToolAfterAdd( DrawingType.Between ),
      [ DrawingType.PathLine ]: this.getDeselectToolAfterAdd( DrawingType.PathLine ),
      [ DrawingType.CurvedLine ]: this.getDeselectToolAfterAdd( DrawingType.CurvedLine ),
      [ DrawingType.VerticalGridLine ]: this.getDeselectToolAfterAdd( DrawingType.VerticalGridLine ),
      [ DrawingType.HorizontalGridLine ]: this.getDeselectToolAfterAdd( DrawingType.HorizontalGridLine ),
      [ DrawingType.Plane ]: this.getDeselectToolAfterAdd( DrawingType.Plane ),
      [ DrawingType.Text ]: this.getDeselectToolAfterAdd( DrawingType.Text )
    };
  }

  set gridOn( gridOn: boolean )
  {
    setValidItem( k( SettingKey.GridOn ), SettingType.Boolean, gridOn );
  }

  get gridOn()
  {
    return getValidItem( k( SettingKey.GridOn ), SettingType.Boolean, true );
  }

  set gridIntervalX( gridIntervalX: number )
  {
    setValidItem( k( SettingKey.GridIntervalX ), SettingType.GridInterval, gridIntervalX );
  }

  get gridIntervalX()
  {
    return getValidItem( k( SettingKey.GridIntervalX ), SettingType.GridInterval, 50 );
  }

  set gridIntervalY( gridIntervalX: number )
  {
    setValidItem( k( SettingKey.GridIntervalY ), SettingType.GridInterval, gridIntervalX );
  }

  get gridIntervalY()
  {
    return getValidItem( k( SettingKey.GridIntervalY ), SettingType.GridInterval, 50 );
  }

  set snapToGrid( snapToGrid: boolean )
  {
    setValidItem( k( SettingKey.SnapToGrid ), SettingType.Boolean, snapToGrid );
  }

  get snapToGrid()
  {
    return getValidItem( k( SettingKey.SnapToGrid ), SettingType.Boolean, true );
  }

  set transparentDrawingProperties( transparentDrawingProperties: boolean )
  {
    setValidItem( k( SettingKey.TransparentDrawingProperties ), SettingType.Boolean, transparentDrawingProperties );
  }

  get transparentDrawingProperties()
  {
    return getValidItem( k( SettingKey.TransparentDrawingProperties ), SettingType.Boolean, true );
  }

  set autoHideToolbar( autoHideToolbar: boolean )
  {
    setValidItem( k( SettingKey.AutoHideToolbar ), SettingType.Boolean, autoHideToolbar );
  }

  get autoHideToolbar()
  {
    return getValidItem( k( SettingKey.AutoHideToolbar ), SettingType.Boolean, false );
  }
}

const settings = new Settings();
export default settings;
