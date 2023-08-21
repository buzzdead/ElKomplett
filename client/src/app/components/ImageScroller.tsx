import React, { useState } from 'react'
import { List, ListItem, Button, Box } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

interface Image {
  pictureUrl: string
}

interface ImageScrollerProps {
  images: Image[]
  onPress: (img: Image) => void
  selectedImageUrl: string
}

const ImageScroller: React.FC<ImageScrollerProps> = ({ images, onPress, selectedImageUrl }) => {
  const [scrollIndex, setScrollIndex] = useState(0)

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'up' && scrollIndex > 0) {
      setScrollIndex(scrollIndex - 1)
    } else if (direction === 'down' && scrollIndex < images.length - 3) {
      setScrollIndex(scrollIndex + 1)
    }
  }

  const handleMouseScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.deltaY > 0 && scrollIndex < images.length - 3) {
      // Scrolling down
      setScrollIndex(scrollIndex + 1)
    } else if (event.deltaY < 0 && scrollIndex > 0) {
      // Scrolling up
      setScrollIndex(scrollIndex - 1)
    }
  }

  return (
    <div onWheel={handleMouseScroll}>
      <Button
        sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}
        onClick={() => handleScroll('up')}
        disabled={scrollIndex === 0}
      >
        <ArrowDropUpIcon fontSize='large'/>
      </Button>
      <List style={{overflow: 'hidden', maxHeight: 550, height: 550 }}>
        {images.slice(scrollIndex, scrollIndex + images.length - 1).map((image, index) => (
          <ListItem style={{justifyContent: 'center'}} key={index}>
            <img
              onClick={() => onPress(image)}
              src={image.pictureUrl}
              alt={`Image ${index}`}
              style={{
                maxHeight: 165,
                minHeight: 165,
                opacity: selectedImageUrl === image.pictureUrl ? 1 : 0.5,
                cursor: 'pointer',
                maxWidth: '80%',
              }}
            />
          </ListItem>
        ))}
      </List>

      <Button
        sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}
        onClick={() => handleScroll('down')}
        disabled={scrollIndex === images.length - 3}
      >
        <ArrowDropDownIcon fontSize={'large'} />
      </Button>
    </div>
  )
}

export default ImageScroller
