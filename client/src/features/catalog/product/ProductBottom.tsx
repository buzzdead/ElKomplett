import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import { grey } from '@mui/material/colors';
import { Paper } from '@mui/material';

interface Props {
    onChangeValue: (value: number) => void
}

export default function ProductBottom({onChangeValue}: Props) {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ marginBottom :2 }}>
      <BottomNavigation
        sx={{gap: 0.5, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          onChangeValue(newValue)
        }}
      >
        <BottomNavigationAction component={Paper}  elevation={5} sx={{fontWeight: 600, backgroundColor: 'secondary.dark', borderRadius: 5, minWidth: 150, minHeight: 60, flex: 0}} label="Produktbeskrivelse" icon={<DescriptionIcon  fontSize='large' />} />
        <BottomNavigationAction component={Paper}  elevation={5} sx={{fontWeight: 600, backgroundColor: 'secondary.dark', borderRadius: 5, minWidth: 150, minHeight: 60, flex: 0}} label="Spesifikasjoner" icon={<SettingsIcon  fontSize='large'/>} />
        <BottomNavigationAction component={Paper}  elevation={5} sx={{fontWeight: 600, backgroundColor: 'secondary.dark', borderRadius: 5, minWidth: 150, minHeight: 60, flex: 0}} label="Dokumentasjon" icon={<PictureAsPdfIcon  fontSize='large' />} />
        
      </BottomNavigation>
    </Box>
  );
}