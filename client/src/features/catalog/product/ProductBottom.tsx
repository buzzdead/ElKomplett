import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import { common, grey } from '@mui/material/colors';
import { Paper } from '@mui/material';
import useView from 'app/hooks/useView';
import Render from 'app/layout/Render';

interface Props {
    onChangeValue: (value: number) => void
}

export default function ProductBottom({onChangeValue}: Props) {
  const [value, setValue] = React.useState(0);
  const view = useView()

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
        <BottomNavigationAction component={Paper}  elevation={5} sx={{'& .MuiBottomNavigationAction-label': {
      color: value === 0 ? 'green' : 'grey'}, fontWeight: 600, backgroundColor: 'secondary.dark', borderRadius: 5, minWidth: 150, minHeight: 60, flex: 0}} label="Produktbeskrivelse" icon={<DescriptionIcon color={value === 0 ? 'success' : 'disabled'}  fontSize='large' />} />
        <BottomNavigationAction component={Paper}  elevation={5} sx={{'& .MuiBottomNavigationAction-label': {
      color: value === 1 ? 'green' : 'grey'}, fontWeight: 600, backgroundColor: 'secondary.dark', borderRadius: 5, minWidth: 150, minHeight: 60, flex: 0}} label="Spesifikasjoner" icon={<SettingsIcon color={value === 1 ? 'success' : 'disabled'}  fontSize='large'/>} />
        <Render condition={!view.view.ipad}>
        <BottomNavigationAction component={Paper}  elevation={5} sx={{'& .MuiBottomNavigationAction-label': {
      color: value === 2 ? 'green' : 'grey'},fontWeight: 600, backgroundColor: 'secondary.dark', borderRadius: 5, minWidth: 150, minHeight: 60, flex: 0}} label="Dokumentasjon" icon={<PictureAsPdfIcon color={value === 2 ? 'success' : 'disabled'} fontSize='large' />} />
        </Render>
      </BottomNavigation>
    </Box>
  );
}