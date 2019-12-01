import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { makeStyles, createStyles, SvgIcon, Tooltip, IconButton, Button, colors } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';
import GridOnIcon from '@material-ui/icons/GridOn';
import GridOffIcon from '@material-ui/icons/GridOff';
import SettingsIcon from '@material-ui/icons/Settings';

import { setTool, incrementScaleLevel, decrementScaleLevel, resetScaleLevel, resetOrigin } from 'store/reducers/editor';
import { showSettings, setGridOn } from 'store/reducers/settings';
import { currentEditorState } from 'store/selectors';

import
{
  DrawingTool,
  DrawingTypeMap,
  Tool,
  DrawingType,
  PLANE_PATH,
  UP_ARROW_PATH,
  DOWN_ARROW_PATH,
  drawingToolDisplayNames,
  MIN_SCALE_LEVEL,
  MAX_SCALE_LEVEL,
  getScale
} from 'utils/draw';
import { ShortcutMap } from 'utils/shortcut';

const CURSOR_PATH = 'M18 2l64 49.116-27.804 4.68 17.3 35.268-14.384 6.936-17.4-35.516-21.712 18.808z';

const useStyles = makeStyles( ( theme ) => createStyles( {
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  buttonGroup: {
    '& > button': {
      border: 'none',
    },
  },
  controls: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& > *': {
      marginRight: theme.spacing( 0.5 ),
    },
  },
  scaleControls: {
    display: 'flex',
    flexDirecton: 'row',
    alignItems: 'center',
  },
  scaleText: {
    minWidth: '3em',
    textAlign: 'center',
    paddingLeft: 0,
    paddingRight: 0,
  },
  recenterButtonCentered: {
    color: colors.lightBlue[ 800 ],
  },
  gridButton: {
    borderRadius: 6,
  },
} ) );

interface PropsFromState
{
  tool: DrawingTool;
  shortcuts: ShortcutMap;
  defaultDrawingColors: DrawingTypeMap<string>;
  originX: number;
  originY: number;
  scaleLevel: number;
  gridOn: boolean;
}

interface PropsFromDispatch
{
  setTool: typeof setTool;
  incrementScaleLevel: typeof incrementScaleLevel;
  decrementScaleLevel: typeof decrementScaleLevel;
  resetScaleLevel: typeof resetScaleLevel;
  resetOrigin: typeof resetOrigin;
  setGridOn: typeof setGridOn;
  showSettings: typeof showSettings;
}

type Props = PropsFromState & PropsFromDispatch;

const Toolbar: React.SFC<Props> = ( {
  tool,
  shortcuts,
  defaultDrawingColors,
  originX,
  originY,
  scaleLevel,
  gridOn,
  ...actions
} ) =>
{
  const styles = useStyles();

  const scale = getScale( scaleLevel );
  const centered = ( originX === 0 && originY === 0 );

  return (
    <div className={styles.root}>
      <ToggleButtonGroup
        className={styles.buttonGroup}
        size="small"
        exclusive={true}
        value={tool}
        onChange={( e, t: DrawingTool ) => actions.setTool( t || Tool.Cursor )}
      >
        <DrawingToolToggleButton value={Tool.Cursor} shortcuts={shortcuts}>
          <SvgIcon viewBox="0 0 100 100">
            <path d={CURSOR_PATH} color="black" />
          </SvgIcon>
        </DrawingToolToggleButton>

        <DrawingToolToggleButton value={DrawingType.Plane} shortcuts={shortcuts}>
          <SvgIcon viewBox="-50 -50 100 100">
            <path d={PLANE_PATH} fill={defaultDrawingColors[ DrawingType.Plane ]} />
          </SvgIcon>
        </DrawingToolToggleButton>

        <DrawingToolToggleButton value={DrawingType.Text} shortcuts={shortcuts}>
          <TextFieldsIcon htmlColor={defaultDrawingColors[ DrawingType.Text ]} />
        </DrawingToolToggleButton>

        <DrawingToolToggleButton value={DrawingType.At} shortcuts={shortcuts}>
          <SvgIcon viewBox="0 0 100 100">
            <path
              d={DOWN_ARROW_PATH}
              fill={defaultDrawingColors[ DrawingType.At ]}
              style={{ transform: 'translateY( -20px )' }}
            />
            <path
              d={UP_ARROW_PATH}
              fill={defaultDrawingColors[ DrawingType.At ]}
              style={{ transform: 'translateY( 20px )' }}
            />
          </SvgIcon>
        </DrawingToolToggleButton>

        <DrawingToolToggleButton value={DrawingType.Above} shortcuts={shortcuts}>
          <SvgIcon viewBox="0 0 100 100">
            <path d={UP_ARROW_PATH} fill={defaultDrawingColors[ DrawingType.Above ]} />
          </SvgIcon>
        </DrawingToolToggleButton>

        <DrawingToolToggleButton value={DrawingType.Below} shortcuts={shortcuts}>
          <SvgIcon viewBox="0 0 100 100">
            <path d={DOWN_ARROW_PATH} fill={defaultDrawingColors[ DrawingType.Below ]} />
          </SvgIcon>
        </DrawingToolToggleButton>

        <DrawingToolToggleButton value={DrawingType.Between} shortcuts={shortcuts}>
          <SvgIcon viewBox="0 0 100 100">
            <path
              d={DOWN_ARROW_PATH}
              fill={defaultDrawingColors[ DrawingType.Between ]}
              style={{ transform: 'translateY( -32px )' }}
            />
            <path
              d={UP_ARROW_PATH}
              fill={defaultDrawingColors[ DrawingType.Between ]}
              style={{ transform: 'translateY( 32px )' }}
            />
          </SvgIcon>
        </DrawingToolToggleButton>

        <DrawingToolToggleButton value={DrawingType.PathLine} shortcuts={shortcuts}>
          <SvgIcon viewBox="0 0 100 100">
            <line x1={10} y1={10} x2={90} y2={90} stroke={defaultDrawingColors[ DrawingType.PathLine ]} strokeWidth={6} />
            <circle cx={10} cy={10} r={10} fill={defaultDrawingColors[ DrawingType.PathLine ]} />
            <circle cx={10} cy={10} r={6} fill="white" />
            <circle cx={90} cy={90} r={10} fill={defaultDrawingColors[ DrawingType.PathLine ]} />
            <circle cx={90} cy={90} r={6} fill="white" />
          </SvgIcon>
        </DrawingToolToggleButton>

        <DrawingToolToggleButton value={DrawingType.CurvedLine} shortcuts={shortcuts}>
          <SvgIcon viewBox="0 0 100 100">
            <path d="M 10 90 C 45 10, 55 90, 90 10" stroke={defaultDrawingColors[ DrawingType.CurvedLine ]} fill="transparent" strokeWidth={6} />
            <circle cx={10} cy={90} r={10} fill={defaultDrawingColors[ DrawingType.CurvedLine ]} />
            <circle cx={10} cy={90} r={6} fill="white" />
            <circle cx={90} cy={10} r={10} fill={defaultDrawingColors[ DrawingType.CurvedLine ]} />
            <circle cx={90} cy={10} r={6} fill="white" />
          </SvgIcon>
        </DrawingToolToggleButton>

        <DrawingToolToggleButton value={DrawingType.VerticalGridLine} shortcuts={shortcuts}>
          <SvgIcon viewBox="0 0 100 100">
            <path d="M20 5 L20 95 M50 5 L50 95 M80 5 L80 95" stroke={defaultDrawingColors[ DrawingType.VerticalGridLine ]} strokeWidth={6} />
          </SvgIcon>
        </DrawingToolToggleButton>

        <DrawingToolToggleButton value={DrawingType.HorizontalGridLine} shortcuts={shortcuts}>
          <SvgIcon viewBox="0 0 100 100">
            <path d="M5 20 L95 20 M5 50 L95 50 M5 80 L95 80" stroke={defaultDrawingColors[ DrawingType.HorizontalGridLine ]} strokeWidth={6} />
          </SvgIcon>
        </DrawingToolToggleButton>

      </ToggleButtonGroup>

      <div className={styles.controls}>

        <div className={styles.scaleControls}>

          <Tooltip placement="bottom" title="Zoom Out">
            <div>
              <IconButton
                size="small"
                onClick={() => actions.decrementScaleLevel()}
                disabled={scaleLevel === MIN_SCALE_LEVEL}
              >
                <RemoveIcon />
              </IconButton>
            </div>
          </Tooltip>

          <Tooltip placement="bottom" title="Reset Zoom">
            <span>
              <Button
                className={styles.scaleText}
                onClick={() => actions.resetScaleLevel()}
              >
                {( scale * 100 ).toFixed( 0 )}%
              </Button>
            </span>
          </Tooltip>

          <Tooltip placement="bottom" title="Zoom In">
            <div>
              <IconButton
                size="small"
                onClick={() => actions.incrementScaleLevel()}
                disabled={scaleLevel === MAX_SCALE_LEVEL}
              >
                <AddIcon />
              </IconButton>
            </div>
          </Tooltip>

        </div>

        <Tooltip placement="bottom" title="Re-center">
          <IconButton
            className={classNames( centered && styles.recenterButtonCentered )}
            size="small"
            color="default"
            onClick={() => actions.resetOrigin()}
          >
            {centered ? (
              <GpsFixedIcon />
            ) : (
                <GpsNotFixedIcon />
              )}
          </IconButton>
        </Tooltip>

        <Tooltip placement="bottom" title={gridOn ? 'Hide Grid' : 'Display Grid'}>
          <IconButton
            size="small"
            className={styles.gridButton}
            onClick={() => actions.setGridOn( !gridOn )}
          >
            {!gridOn ? (
              <GridOffIcon />
            ) : (
                <GridOnIcon />
              )}
          </IconButton>
        </Tooltip>

        <Tooltip placement="bottom" title="Settings">
          <IconButton
            size="small"
            onClick={() => actions.showSettings()}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>

      </div>

    </div>
  );
};

interface DrawingToolToggleButtonProps
{
  value: DrawingTool;
  shortcuts: ShortcutMap;
  children: React.ReactElement;
}

const DrawingToolToggleButton: React.SFC<DrawingToolToggleButtonProps> = ( { value: tool, shortcuts, children, ...props } ) =>
{
  let title = drawingToolDisplayNames[ tool ];
  let shortcut = shortcuts[ tool ];
  if( shortcut )
  {
    title += ` (${shortcut})`;
  }

  return (
    <Tooltip title={title}>
      <ToggleButton {...props} value={tool}>
        {children}
      </ToggleButton>
    </Tooltip>
  );
};

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    tool: currentEditorState( state ).tool,
    shortcuts: state.settings.shortcuts,
    defaultDrawingColors: state.settings.defaultDrawingColors,
    originX: currentEditorState( state ).originX,
    originY: currentEditorState( state ).originY,
    scaleLevel: currentEditorState( state ).scaleLevel,
    gridOn: state.settings.gridOn,
  } ),
  {
    setTool,
    incrementScaleLevel,
    decrementScaleLevel,
    resetScaleLevel,
    resetOrigin,
    setGridOn,
    showSettings,
  }
)( Toolbar );
