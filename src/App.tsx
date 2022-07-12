import React from 'react';
import { Box, Typography } from '@mui/material';
import campaigns from './mock/campaigns.json';
import DataTable from './components/DataTable';
import { appStyles, appTitleStyles } from './styles';

function App() {
  return (
    <Box sx={appStyles}>
      <Typography sx={appTitleStyles}>Analytics Data</Typography>
      <DataTable data={campaigns} />
    </Box>
  );
}

export default App;
