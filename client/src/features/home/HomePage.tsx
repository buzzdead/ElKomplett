import { Box, Typography } from '@mui/material';
import React, { useRef } from 'react'
import Slider from "react-slick";
import './sliderStyles.css'

export default function HomePage() {
    const sliderRef = useRef<Slider | null>(null);

    const settings = {
        dots: true,
        infinite: true,
        fade: true,
        speed: 500,
        slidesToShow: 1,
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
        <div style={{overflowX: "hidden"}}>
            <Slider ref={sliderRef} {...settings}>
                <div>
                    <img src="/images/hero4.webp" alt="hero" style={{display: 'block', width: '100%', maxHeight: 500}} onClick={handleImageClick}/>
                </div>
                
            </Slider>
            <Box display='flex' justifyContent='center' sx={{p: 4}}>
                <Typography variant='h1' sx={{userSelect: 'none'}}>
                    Welcome to the shop
                </Typography>
            </Box>
        </div>
    )
}