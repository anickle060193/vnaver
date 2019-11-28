import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Dialog, DialogContent, DialogActions, Button, FormControlLabel, Checkbox, Typography, TextField, makeStyles, Grid, createStyles } from '@material-ui/core';

import ShortcutInput from 'components/SettingsDialog/ShortcutInput';
import
{
  hideSettings,
  setShortcut,
  setDefaultDrawingColor,
  setSnapToGrid,
  setGridIntervalX,
  setGridIntervalY,
  setDeselectToolAfterAdd,
  setTransparentDrawingProperties,
  setAutoHideToolbar
} from 'store/reducers/settings';
import { drawingToolDisplayNames, DrawingTool, DrawingTypeMap, DrawingType, Tool } from 'utils/draw';
import { ShortcutMap } from 'utils/shortcut';

import './styles.css';

const useStyles = makeStyles( ( theme ) => createStyles( {
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginTop: theme.spacing( 2 ),
  },
  noWrap: {
    whiteSpace: 'nowrap',
  },
  centerCell: {
    textAlign: 'center',
  },
} ) );

interface PropsFromState
{
  show: boolean;
  shortcuts: ShortcutMap;
  defaultDrawingColors: DrawingTypeMap<string>;
  deselectToolAfterAdd: DrawingTypeMap<boolean>;
  gridIntervalX: number;
  gridIntervalY: number;
  snapToGrid: boolean;
  transparentDrawingProperties: boolean;
  autoHideToolbar: boolean;
}

interface PropsFromDispatch
{
  hideSettings: typeof hideSettings;
  setShortcut: typeof setShortcut;
  setDefaultDrawingColor: typeof setDefaultDrawingColor;
  setDeselectToolAfterAdd: typeof setDeselectToolAfterAdd;
  setGridIntervalX: typeof setGridIntervalX;
  setGridIntervalY: typeof setGridIntervalY;
  setSnapToGrid: typeof setSnapToGrid;
  setTransparentDrawingProperties: typeof setTransparentDrawingProperties;
  setAutoHideToolbar: typeof setAutoHideToolbar;
}

type Props = PropsFromState & PropsFromDispatch;

const SettingsDialog: React.SFC<Props> = ( {
  show,
  shortcuts,
  defaultDrawingColors,
  deselectToolAfterAdd,
  gridIntervalX,
  gridIntervalY,
  snapToGrid,
  transparentDrawingProperties,
  autoHideToolbar,
  ...actions
} ) =>
{
  const styles = useStyles();

  function onClose()
  {
    actions.hideSettings();
  }

  return (
    <Dialog
      open={show}
      onClose={onClose}
      scroll="paper"
      maxWidth="lg"
      fullWidth={true}
    >
      <DialogContent className={styles.dialogContent}>
        <Typography variant="h5">Grid Settings:</Typography>

        <FormControlLabel
          label="Snap to Grid"
          control={<Checkbox />}
          value={snapToGrid}
          onChange={( e, checked ) => actions.setSnapToGrid( checked )}
        />

        <Grid container={true} spacing={1}>
          <Grid item={true} md={3} sm={4} xs={12}>
            <TextField
              type="number"
              label="Grid Interval X"
              fullWidth={true}
              value={gridIntervalX}
              onChange={( e ) => actions.setGridIntervalX( parseInt( e.target.value, 10 ) )}
            />
          </Grid>
          <Grid item={true} md={3} sm={4} xs={12}>
            <TextField
              type="number"
              label="Grid Interval Y"
              fullWidth={true}
              value={gridIntervalY}
              onChange={( e ) => actions.setGridIntervalY( parseInt( e.target.value, 10 ) )}
            />
          </Grid>
        </Grid>

        <Typography variant="h5" className={styles.header}>Tools Settings:</Typography>

        <table>
          <thead>
            <tr>
              <th>Tool</th>
              <th>Shortcut</th>
              <th className={classNames( styles.centerCell, styles.noWrap )}>Default Color</th>
              <th className={styles.centerCell}>Deselect After Use</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries( drawingToolDisplayNames ).map( ( [ tool, name ] ) => (
              <tr key={tool}>
                <td className={styles.noWrap}>{name}:</td>
                <td>
                  <ShortcutInput
                    className="form-control"
                    shortcut={shortcuts[ tool as DrawingTool ]}
                    onChange={( shortcut ) => actions.setShortcut( {
                      tool: tool as DrawingTool,
                      shortcut
                    } )}
                  />
                </td>
                {( tool !== Tool.Cursor ) && (
                  <>
                    <td className={styles.centerCell}>
                      <input
                        type="color"
                        value={defaultDrawingColors[ tool as DrawingType ]}
                        onChange={( e ) => actions.setDefaultDrawingColor( {
                          drawingType: tool as DrawingType,
                          color: e.target.value
                        } )}
                      />
                    </td>
                    <td className={styles.centerCell}>
                      <Checkbox
                        checked={deselectToolAfterAdd[ tool as DrawingType ]}
                        onChange={( e, checked ) => actions.setDeselectToolAfterAdd( {
                          drawingType: tool as DrawingType,
                          deselectToolAfterAdd: checked
                        } )}
                      />
                    </td>
                  </>
                )}
              </tr>
            ) )}
          </tbody>
        </table>

        <Typography variant="h5" className={styles.header}>Other Settings:</Typography>

        <FormControlLabel
          label="Display drawing properties dialog as transparent unless hovering"
          control={<Checkbox />}
          checked={transparentDrawingProperties}
          onChange={( e, checked ) => actions.setTransparentDrawingProperties( checked )}
        />

        <FormControlLabel
          label="Hide toolbar when not hovering"
          control={<Checkbox />}
          checked={autoHideToolbar}
          onChange={( e, checked ) => actions.setAutoHideToolbar( checked )}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    show: state.settings.show,
    shortcuts: state.settings.shortcuts,
    defaultDrawingColors: state.settings.defaultDrawingColors,
    deselectToolAfterAdd: state.settings.deselectToolAfterAdd,
    gridIntervalX: state.settings.gridIntervalX,
    gridIntervalY: state.settings.gridIntervalY,
    snapToGrid: state.settings.snapToGrid,
    transparentDrawingProperties: state.settings.transparentDrawingProperties,
    autoHideToolbar: state.settings.autoHideToolbar
  } ),
  {
    hideSettings,
    setShortcut,
    setDefaultDrawingColor,
    setDeselectToolAfterAdd,
    setGridIntervalX,
    setGridIntervalY,
    setSnapToGrid,
    setTransparentDrawingProperties,
    setAutoHideToolbar
  }
)( SettingsDialog );
