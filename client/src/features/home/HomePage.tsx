import { useRef } from 'react';
import Slider from 'react-slick';
import './sliderStyles.css';
import Categories from './Categories';
import { Box, Divider, useTheme, useMediaQuery } from '@mui/material';
import useView from 'app/hooks/useView';

export default function HomePage() {
  const sliderRef = useRef<Slider | null>(null);
  const view = useView();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const settings = {
    dots: true,
    infinite: true,
    fade: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const handleImageClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <div style={{ overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 5 }}>
      <Divider />
      <Slider ref={sliderRef} {...settings}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: isMobile ? '0' : '0 15%' }}>
          <Box component="img"
               sx={{
                 objectFit: 'cover',
                 width: isMobile ? '100%' : '80%', // Adjusting the width based on the device
                 borderRadius: 2, // Optional: adds rounded corners
                 margin: 'auto',
                 paddingTop: 2
               }}
               src='/images/hero7.webp'
               alt='Hero'
               onClick={handleImageClick}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: isMobile ? '0' : '0 15%' }}>
          <Box component="img"
               sx={{
                 objectFit: 'cover',
                 width: isMobile ? '100%' : '80%', // Adjusting the width based on the device
                 borderRadius: 2, // Optional: adds rounded corners
                 margin: 'auto',
                 paddingTop: 2
               }}
               src='/images/hero8.webp'
               alt='Hero'
               onClick={handleImageClick}
          />
        </div>
      </Slider>
      <Box sx={{ padding: isMobile ? 1 : 5, paddingX: {sx: 0, md: 20} }}>
        <Categories />
      </Box>
    </div>
  );
}
