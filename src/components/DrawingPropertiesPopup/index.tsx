import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Button, makeStyles, createStyles, Paper, Typography, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import
{
  BasicDrawingProperties,
  BetweenDrawingProperties,
  VerticalGridLineDrawingProperties,
  HorizontalGridLineDrawingProperties,
  PlaneDrawingProperties,
  PathLineDrawingProperties,
  TextDrawingProperties,
  CurvedLineDrawingProperties
} from './DrawingProperties';

import { deleteDrawing, updateDrawing, deselectDrawing } from 'store/reducers/drawings';
import { currentDrawingsState } from 'store/selectors';

import { Drawing, DrawingType, DrawingMap, drawingToolDisplayNames } from 'utils/draw';
import { assertNever } from 'utils/utils';

const useStyles = makeStyles( ( theme ) => createStyles( {
  root: {
    padding: theme.spacing( 2 ),
    position: 'relative',
    maxWidth: '100vw',
    minWidth: '400px',
    width: '20vw',
  },
  transparent: {
    opacity: 0.3,
    '&:hover': {
      opacity: 1.0,
    },
  },
  title: {
    width: '100%',
    textAlign: 'center',
    marginBottom: theme.spacing( 1 ),
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: theme.spacing( 1 ),
  },
  deleteButton: {
    marginTop: theme.spacing( 1 ),
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
} ) );

interface PropsFromState
{
  drawings: DrawingMap;
  selectedDrawingId: string | null;
  transparentDrawingProperties: boolean;
}

interface PropsFromDispatch
{
  deleteDrawing: typeof deleteDrawing;
  updateDrawing: typeof updateDrawing;
  deselectDrawing: typeof deselectDrawing;
}

type Props = PropsFromState & PropsFromDispatch;

const DrawingPropertiesPopup: React.SFC<Props> = ( {
  drawings,
  selectedDrawingId,
  transparentDrawingProperties,
  ...actions
} ) =>
{
  const styles = useStyles();

  if( !selectedDrawingId )
  {
    return null;
  }

  const selectedDrawing = drawings[ selectedDrawingId ];

  function onCloseClick()
  {
    actions.deselectDrawing();
  }

  function onDrawingChange( drawing: Drawing )
  {
    actions.updateDrawing( drawing );
  }

  function onColorChange( drawing: Drawing, color: string )
  {
    actions.updateDrawing( {
      ...drawing,
      color
    } );
  }

  function onDeleteClick()
  {
    if( selectedDrawingId )
    {
      actions.deleteDrawing( selectedDrawingId );
    }
  }

  let drawingProperties: React.ReactNode;

  if( selectedDrawing.type === DrawingType.Above
    || selectedDrawing.type === DrawingType.At
    || selectedDrawing.type === DrawingType.Below )
  {
    drawingProperties = (
      <BasicDrawingProperties
        drawing={selectedDrawing}
        onChange={onDrawingChange}
        onColorChange={( color ) => onColorChange( selectedDrawing, color )}
      />
    );
  }
  else if( selectedDrawing.type === DrawingType.Between )
  {
    drawingProperties = (
      <BetweenDrawingProperties
        drawing={selectedDrawing}
        onChange={onDrawingChange}
        onColorChange={( color ) => onColorChange( selectedDrawing, color )}
      />
    );
  }
  else if( selectedDrawing.type === DrawingType.PathLine )
  {
    drawingProperties = (
      <PathLineDrawingProperties
        drawing={selectedDrawing}
        onChange={onDrawingChange}
        onColorChange={( color ) => onColorChange( selectedDrawing, color )}
      />
    );
  }
  else if( selectedDrawing.type === DrawingType.CurvedLine )
  {
    drawingProperties = (
      <CurvedLineDrawingProperties
        drawing={selectedDrawing}
        onChange={onDrawingChange}
        onColorChange={( color ) => onColorChange( selectedDrawing, color )}
      />
    );
  }
  else if( selectedDrawing.type === DrawingType.VerticalGridLine )
  {
    drawingProperties = (
      <VerticalGridLineDrawingProperties
        drawing={selectedDrawing}
        onChange={onDrawingChange}
        onColorChange={( color ) => onColorChange( selectedDrawing, color )}
      />
    );
  }
  else if( selectedDrawing.type === DrawingType.HorizontalGridLine )
  {
    drawingProperties = (
      <HorizontalGridLineDrawingProperties
        drawing={selectedDrawing}
        onChange={onDrawingChange}
        onColorChange={( color ) => onColorChange( selectedDrawing, color )}
      />
    );
  }
  else if( selectedDrawing.type === DrawingType.Plane )
  {
    drawingProperties = (
      <PlaneDrawingProperties
        drawing={selectedDrawing}
        onChange={onDrawingChange}
        onColorChange={( color ) => onColorChange( selectedDrawing, color )}
      />
    );
  }
  else if( selectedDrawing.type === DrawingType.Text )
  {
    drawingProperties = (
      <TextDrawingProperties
        drawing={selectedDrawing}
        onChange={onDrawingChange}
        onColorChange={( color ) => onColorChange( selectedDrawing, color )}
      />
    );
  }
  else
  {
    throw assertNever( selectedDrawing.type );
  }

  return (
    <Paper
      className={classNames(
        styles.root,
        transparentDrawingProperties && styles.transparent,
      )}
    >
      <Typography
        className={styles.title}
        variant="h5"
        component="span"
        display="block"
      >
        {drawingToolDisplayNames[ selectedDrawing.type ]}
      </Typography>
      <IconButton
        className={styles.closeButton}
        size="small"
        onClick={onCloseClick}
      >
        <CloseIcon />
      </IconButton>
      {drawingProperties}
      <Button
        className={styles.deleteButton}
        variant="contained"
        onClick={onDeleteClick}
      >
        Delete
      </Button>
    </Paper>
  );
};

export default connect<PropsFromState, PropsFromDispatch, {}, RootState>(
  ( state ) => ( {
    drawings: currentDrawingsState( state ).drawings,
    selectedDrawingId: currentDrawingsState( state ).selectedDrawingId,
    transparentDrawingProperties: state.settings.transparentDrawingProperties
  } ),
  {
    deleteDrawing,
    updateDrawing,
    deselectDrawing
  }
)( DrawingPropertiesPopup );
