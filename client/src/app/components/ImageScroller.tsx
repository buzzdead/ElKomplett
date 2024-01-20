import React, { useCallback, useEffect, useRef, useState } from 'react'
import { List, ListItem, Button } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeft from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';
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
      setScrollIndex(scrollIndex + 1)
    } else if (event.deltaY < 0 && scrollIndex > 0) {
      setScrollIndex(scrollIndex - 1)
    }
  }
  
  const preventDefault = (event: WheelEvent) => {
    event.preventDefault();
  };
  
  const handleMouseEnter = useCallback(() => {
    document.addEventListener('wheel', preventDefault, { passive: false });
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    document.removeEventListener('wheel', preventDefault);
  }, [])
  
  useEffect(() => {
    const divElement = divRef.current;
  
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
  }, [handleMouseEnter, handleMouseLeave]);

  return (
    <div ref={divRef} onWheel={handleMouseScroll} style={{display: 'flex', flexDirection: horizontal ? 'row' : 'column', justifyContent: 'center', width: '85%'}}>
      <Render condition={images.length > 3}>
      <Button
        sx={{ display: 'flex', width: horizontal ? '0' : '100%', justifyContent: 'center' }}
        onClick={() => handleScroll('up')}
        disabled={scrollIndex === 0}
      >
        <Render condition={horizontal}>
          <ArrowLeft fontSize='large'/>
          <ArrowDropUpIcon fontSize='large'/>
        </Render>
        
      </Button>
      </Render>
      <List style={{overflow: 'hidden', maxWidth: horizontal ? 220 : 400, maxHeight: horizontal ? 150 : 375, height: horizontal ? 150 : 450, flexDirection: horizontal ? 'row' : 'column', display: 'flex' }}>
        {images.slice(scrollIndex, scrollIndex + (images.length)).map((image, index) => (
          <ListItem style={{justifyContent: 'center', paddingLeft: 5, paddingRight: 5}} key={index}>
            <img
              onClick={() => onPress(image)}
              src={image.pictureUrl}
              alt={`scrollable ${index}`}
              style={{
                maxHeight: horizontal ? 75 : 110,
                minHeight: horizontal ? 75 : 110,
                opacity: selectedImageUrl === image.pictureUrl ? 1 : 0.5,
                cursor: 'pointer',
                maxWidth: horizontal ? 50 : 150
              }}
            />
          </ListItem>
        ))}
      </List>
      <Render condition={images.length > 3}>
      <Button
        sx={{ display: 'flex', width: horizontal ? '0' : '100%', justifyContent: 'center' }}
        onClick={() => handleScroll('down')}
        disabled={scrollIndex === images.length - 3}
      >
         <Render condition={horizontal}>
          <ArrowRight fontSize='large'/>
          <ArrowDropDownIcon fontSize={'large'} />
        </Render>
       
      </Button>
      </Render>
    </div>
  )
}

export default ImageScroller
