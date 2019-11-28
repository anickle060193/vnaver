import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core';

import DocumentTabs from 'components/DocumentTabs';
import Toolbar from 'components/Toolbar';
import DrawField from 'components/DrawField';
import DrawingPropertiesPopup from 'components/DrawingPropertiesPopup';
import DrawFieldControls from 'components/DrawFieldControls';

const useStyles = makeStyles( ( theme ) => createStyles( {
  mainLayout: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  documentLayout: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  drawFieldContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  drawingPropertiesContainer: {
    position: 'fixed',
    margin: '1rem',
    right: '0%',
    bottom: '0%',
  },
  drawFieldControls: {
    position: 'absolute',
    margin: '1rem',
    right: '0%',
    top: '0%',
  },
} ) );

const Layout: React.SFC = () =>
{
  const styles = useStyles();

  return (
    <div className={styles.mainLayout}>
      <DocumentTabs />
      <div className={styles.documentLayout}>
        <div className={styles.drawFieldContainer}>
          <DrawField />
        </div>
        <Toolbar />
        <div className={styles.drawingPropertiesContainer}>
          <DrawingPropertiesPopup />
        </div>
        <div className={styles.drawFieldControls}>
          <DrawFieldControls />
        </div>
      </div>
    </div>
  );
};

export default Layout;
