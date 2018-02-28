import { reducerWithInitialState } from 'typescript-fsa-reducers';
import actionCreatorFactory from 'typescript-fsa';

import { DrawingTool, DrawingTypeMap, DrawingType } from 'utils/draw';
import settings from 'utils/settings';
import { ShortcutMap } from 'utils/shortcut';

export interface State
{
  show: boolean;
  gridOn: boolean;
  snapToGrid: boolean;
  gridIntervalX: number;
  gridIntervalY: number;
  shortcuts: ShortcutMap;
  defaultDrawingColors: DrawingTypeMap<string>;
  deselectToolAfterAdd: DrawingTypeMap<boolean>;
}

const initialState: State = {
  show: false,
  gridOn: settings.gridOn,
  snapToGrid: settings.snapToGrid,
  gridIntervalX: settings.gridIntervalX,
  gridIntervalY: settings.gridIntervalY,
  shortcuts: settings.getAllShortcutSettings(),
  defaultDrawingColors: settings.getAllDefaultDrawingColorSettings(),
  deselectToolAfterAdd: settings.getAllDeselectToolAfterAdd()
};

const actionCreator = actionCreatorFactory();

export const showSettings = actionCreator( 'SHOW_SETTINGS' );
export const hideSettings = actionCreator( 'HIDE_SETTINGS' );
export const setGridOn = actionCreator<boolean>( 'SET_GRID_ON' );
export const setSnapToGrid = actionCreator<boolean>( 'SET_SNAP_TO_GRID' );
export const setGridIntervalX = actionCreator<number>( 'SET_GRID_INTERVAL_X' );
export const setGridIntervalY = actionCreator<number>( 'SET_GRID_INTERVAL_Y' );
export const setShortcut = actionCreator<{ tool: DrawingTool, shortcut: string }>( 'SET_SHORTCUT' );
export const setDefaultDrawingColor = actionCreator<{ drawingType: DrawingType, color: string }>( 'SET_DEFAULT_DRAWING_COLOR' );
export const setDeselectToolAfterAdd = actionCreator<{ drawingType: DrawingType, deselectToolAfterAdd: boolean }>( 'SET_CLEAR_TOOL_AFTER_ADD' );

export const reducer = reducerWithInitialState( initialState )
  .case( showSettings, ( state ) =>
    ( {
      ...state,
      show: true
    } ) )
  .case( hideSettings, ( state ) =>
    ( {
      ...state,
      show: false
    } ) )
  .case( setGridOn, ( state, gridOn ) =>
  {
    settings.gridOn = gridOn;

    return {
      ...state,
      gridOn: settings.gridOn
    };
  } )
  .case( setSnapToGrid, ( state, snapToGrid ) =>
  {
    settings.snapToGrid = snapToGrid;

    return {
      ...state,
      snapToGrid: settings.snapToGrid
    };
  } )
  .case( setGridIntervalX, ( state, gridIntervalX ) =>
  {
    settings.gridIntervalX = gridIntervalX;

    return {
      ...state,
      gridIntervalX: settings.gridIntervalX
    };
  } )
  .case( setGridIntervalY, ( state, gridIntervalY ) =>
  {
    settings.gridIntervalY = gridIntervalY;

    return {
      ...state,
      gridIntervalY: settings.gridIntervalY
    };
  } )
  .case( setShortcut, ( state, { tool, shortcut } ) =>
  {
    let shortcuts = { ...state.shortcuts };

    settings.setShortcutSetting( tool, shortcut );
    shortcuts[ tool ] = shortcut;

    Object.keys( shortcuts ).forEach( ( t: DrawingTool ) =>
    {
      if( t !== tool && shortcuts[ t ] === shortcut )
      {
        shortcuts[ t ] = '';
        settings.setShortcutSetting( t, '' );
      }
    } );

    return {
      ...state,
      shortcuts: settings.getAllShortcutSettings()
    };
  } )
  .case( setDefaultDrawingColor, ( state, { drawingType, color } ) =>
  {
    settings.setDefaultDrawingColorSetting( drawingType, color );

    return {
      ...state,
      defaultDrawingColors: {
        ...state.defaultDrawingColors,
        [ drawingType ]: settings.getDefaultDrawingColorSetting( drawingType )
      }
    };
  } )
  .case( setDeselectToolAfterAdd, ( state, { drawingType, deselectToolAfterAdd } ) =>
  {
    settings.setDeselectToolAfterAdd( drawingType, deselectToolAfterAdd );

    return {
      ...state,
      deselectToolAfterAdd: {
        ...state.deselectToolAfterAdd,
        [ drawingType ]: settings.getDeselectToolAfterAdd( drawingType )
      }
    };
  } );
