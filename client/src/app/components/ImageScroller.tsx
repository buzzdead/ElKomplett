import React, { useEffect, useRef, useState } from 'react'
import { List, ListItem, Button, Box } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Render from 'app/layout/Render';

interface Image {
  pictureUrl: string
}

interface ImageScrollerProps {
  images: Image[]
  onPress: (img: Image) => void
  selectedImageUrl: string
  horizontal?: boolean
}

const ImageScroller: React.FC<ImageScrollerProps> = ({ images, onPress, selectedImageUrl, horizontal }) => {
  const [scrollIndex, setScrollIndex] = useState(0)
  const divRef = useRef<HTMLDivElement | null>(null);

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
  useEffect(() => {
    const preventDefault = (event: WheelEvent) => {
      event.preventDefault();
    };

    const divElement = divRef.current;

    const handleMouseEnter = () => {
      document.addEventListener('wheel', preventDefault, { passive: false });
    };

    const handleMouseLeave = () => {
      document.removeEventListener('wheel', preventDefault);
    };

    if (divElement) {
      divElement.addEventListener('mouseenter', handleMouseEnter);
      divElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (divElement) {
        divElement.removeEventListener('mouseenter', handleMouseEnter);
        divElement.removeEventListener('mouseleave', handleMouseLeave);
      }
      document.removeEventListener('wheel', preventDefault);
    };
  }, []);

  return (
    <div ref={divRef} onWheel={handleMouseScroll}>
      <Render condition={images.length > 3}>
      <Button
        sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}
        onClick={() => handleScroll('up')}
        disabled={scrollIndex === 0}
      >
        <ArrowDropUpIcon fontSize='large'/>
      </Button>
      </Render>
      <List style={{overflow: 'hidden', maxHeight: horizontal ? 150 : 375, height: horizontal ? 150 : 450, flexDirection: horizontal ? 'row' : 'column', display: 'flex' }}>
        {images.slice(scrollIndex, scrollIndex + (images.length)).map((image, index) => (
          <ListItem style={{justifyContent: 'center'}} key={index}>
            <img
              onClick={() => onPress(image)}
              src={image.pictureUrl}
              alt={`Image ${index}`}
              style={{
                maxHeight: 110,
                minHeight: 110,
                opacity: selectedImageUrl === image.pictureUrl ? 1 : 0.5,
                cursor: 'pointer',
                maxWidth: '80%',
              }}
            />
          </ListItem>
        ))}
      </List>
      <Render condition={images.length > 3}>
      <Button
        sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}
        onClick={() => handleScroll('down')}
        disabled={scrollIndex === images.length - 3}
      >
        <ArrowDropDownIcon fontSize={'large'} />
      </Button>
      </Render>
    </div>
  )
}

export default ImageScroller
