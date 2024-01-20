import { useTheme } from '@emotion/react'
import { Box, Theme, Typography } from '@mui/material'
import { Category } from 'app/hooks/useCategories'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

type CategoryItem = {
  category: Category
  isSelected: boolean
  children: React.ReactNode
  theme: any
}

interface Props {
  categories: Category[]
  category: Category
}

export const CategoryList = ({ categories, category }: Props) => {
  const theme = useTheme()
  const categoryVariants = (theme: Theme) => {
    return {
      initial: {
        scale: 1,
        color: theme.palette.mode === 'dark' ? 'white' : 'black', // Initial color of the text
      },
      hover: {
        scale: 1.1,
        color:
          theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.warning.light,
        transition: {
          duration: 0.05,
          ease: 'easeInOut',
        },
      },
      selected: {
        scale: 1,
        color:
          theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.warning.light,
        transition: {
          duration: 0.0,
          ease: 'easeInOut',
        },
      },
    }
  }

  const CategoryItem = ({ category, isSelected, children, theme }: CategoryItem) => {
    return (
      <Link to={`/catalog/categories/${category.id}`} style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            borderRadius: '10px',
            backgroundColor: isSelected
              ? theme.palette.mode === 'dark'
                ? 'grey.900'
                : 'primary.main'
              : 'transparent',
          }}
        >
          <motion.div
            variants={categoryVariants(theme)}
            initial='initial'
            whileHover='hover'
            animate={isSelected ? 'selected' : 'initial'}
            style={{
              padding: '10px 10px',
              cursor: 'pointer',
              userSelect: 'none',
              color: isSelected
                ? theme.palette.mode === 'dark'
                  ? theme.palette.brandSecondary.light
                  : theme.palette.warning.light
                : theme.palette.mode,
              fontWeight: isSelected ? 600 : 400,
              fontSize: isSelected ? '1rem' : '0.875rem',
              display: 'block',
            }}
          >
            <Typography
              sx={{
                maxHeight: 20,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {children}
            </Typography>
          </motion.div>
        </Box>
      </Link>
    )
  }
  return (
    <>
      {categories.map((c) => (
        <CategoryItem key={c.id} category={c} isSelected={c.id === category.id} theme={theme}>
          {c.title}
        </CategoryItem>
      ))}
    </>
  )
}
