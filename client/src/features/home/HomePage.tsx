import { useRef } from 'react'
import Slider from 'react-slick'
import './sliderStyles.css'
import Categories from './Categories'
import { Box, Divider } from '@mui/material'

export default function HomePage() {
  const sliderRef = useRef<Slider | null>(null)

  const settings = {
    dots: true,
    infinite: true,
    fade: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  }
  const handleImageClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext()
    }
  }
  return (
    <div style={{ overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: 15, marginBottom: 25 }}>
        <Divider />
      <Slider ref={sliderRef} {...settings}>
        <div style={{ display: 'flex'}}>
          <img
            src='/images/hero4.webp'
            alt='hero'
            className='slider-image'
            onClick={handleImageClick}
          />
        </div>
      </Slider>
      <Box sx={{ marginLeft: 12.5, marginRight: 12.5 }}>
        <Categories />
      </Box>
      </div>
  )
}
