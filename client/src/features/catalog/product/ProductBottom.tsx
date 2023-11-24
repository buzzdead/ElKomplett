import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import { Theme, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import useView from 'app/hooks/useView';
import Render from 'app/layout/Render';

interface Props {
  onChangeValue: (value: number) => void;
}

export default function ProductBottom({ onChangeValue }: Props) {
  const [value, setValue] = React.useState(0);
  const view = useView();
  const theme = useTheme(); // Use the theme hook

  const BottomNavigationActionStyle = (theme: Theme, isActive: boolean) => ({
    '& .MuiBottomNavigationAction-label': {
      color: isActive ? theme.palette.common.white : theme.palette.text.secondary,
    },
    fontWeight: 600,
    backgroundColor: isActive ? theme.palette.brandSecondary.main : theme.palette.action.disabledBackground,
    borderRadius: 1,
    minWidth: 150,
    minHeight: 60,
    '& .MuiSvgIcon-root': {
      color: isActive ? theme.palette.common.white : theme.palette.action.disabled,
    },
  });
  return (
    <Box sx={{ marginBottom: 2 }}>
      <BottomNavigation
        sx={{
          gap: 0.5,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          backgroundColor: theme.palette.background.paper, // Use background color from theme
        }}
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          onChangeValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Produktbeskrivelse"
          icon={<DescriptionIcon color={value === 0 ? 'success' : 'disabled'} fontSize='large' />}
          sx={BottomNavigationActionStyle(theme, value === 0)}
        />
        <BottomNavigationAction
          label="Spesifikasjoner"
          icon={<SettingsIcon color={value === 1 ? 'success' : 'disabled'} fontSize='large'/>}
          sx={BottomNavigationActionStyle(theme, value === 1)}
        />
        <Render condition={!view.view.ipad}>
          <BottomNavigationAction
            label="Dokumentasjon"
            icon={<PictureAsPdfIcon color={value === 2 ? 'success' : 'disabled'} fontSize='large' />}
            sx={BottomNavigationActionStyle(theme, value === 2)}
          />
        </Render>
      </BottomNavigation>
    </Box>
  );
}
