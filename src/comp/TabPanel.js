import React from 'react';
import { Typography, Box } from '@material-ui/core';

const TabPanel = ({ children, value, index }) => {

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={ value !== index }
      id={ `simple-tabpanel-${ index }` }
      aria-labelledby={ `simple-tab-${ index }` }
    >
      <Box p={ 3 }>{ children }</Box>
    </Typography>
  );
}

export default TabPanel;