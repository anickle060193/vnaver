import { reducerWithInitialState } from 'typescript-fsa-reducers';
import actionCreatorFactory from 'typescript-fsa';

import { DrawingTool, DrawingTypeMap, DrawingType } from 'utils/draw';
import
{
  getAllShortcutSettings,
  setShortcutSetting,
  setGridOnSetting,
  getGridOnSetting,
  getAllDefaultDrawingColorSettings,
  setDefaultDrawingColorSetting
} from 'utils/settings';
import { ShortcutMap } from 'utils/shortcut';

export interface State
{
  show: boolean;
  gridOn: boolean;
  shortcuts: ShortcutMap;
  defaultDrawingColors: DrawingTypeMap<string>;
}

const initialState: State = {
  show: false,
  gridOn: getGridOnSetting(),
  shortcuts: getAllShortcutSettings(),
  defaultDrawingColors: getAllDefaultDrawingColorSettings()
};

const actionCreator = actionCreatorFactory();

export const showSettings = actionCreator( 'SHOW_SETTINGS' );
export const hideSettings = actionCreator( 'HIDE_SETTINGS' );
export const setGridOn = actionCreator<boolean>( 'SET_GRID_ON' );
export const setShortcut = actionCreator<{ tool: DrawingTool, shortcut: string }>( 'SET_SHORTCUT' );
export const setDefaultDrawingColor = actionCreator<{ drawingType: DrawingType, color: string }>( 'SET_DEFAULT_DRAWING_COLOR' );

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
    setGridOnSetting( gridOn );
    return {
      ...state,
      gridOn
    };
  } )
  .case( setShortcut, ( state, { tool, shortcut } ) =>
  {
    let shortcuts = { ...state.shortcuts };

    setShortcutSetting( tool, shortcut );
    shortcuts[ tool ] = shortcut;

    Object.keys( shortcuts ).forEach( ( t: DrawingTool ) =>
    {
      if( t !== tool && shortcuts[ t ] === shortcut )
      {
        shortcuts[ t ] = '';
        setShortcutSetting( t, '' );
      }
    } );

    return {
      ...state,
      shortcuts: shortcuts
    };
  } )
  .case( setDefaultDrawingColor, ( state, { drawingType, color } ) =>
  {
    setDefaultDrawingColorSetting( drawingType, color );
    return {
      ...state,
      defaultDrawingColors: {
        ...state.defaultDrawingColors,
        [ drawingType ]: color
      }
    };
  } );
