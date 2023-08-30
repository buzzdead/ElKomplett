import { useRef } from 'react'
import Slider from 'react-slick'
import './sliderStyles.css'
import Categories from './Categories'
import { Box, Divider } from '@mui/material'
import useView from 'app/hooks/useView'

export default function HomePage() {
  const sliderRef = useRef<Slider | null>(null)
  const view = useView()

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
      <Box sx={{ marginLeft: view.view.ipad ? 1 : 12.5, marginRight: view.view.ipad ? 1 : 12.5 }}>
        <Categories />
      </Box>
      </div>
  )
}
