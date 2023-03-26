import { Box, Typography, Pagination, PaginationItem } from '@mui/material'
import React, { useState } from 'react'
import { MetaData } from '../models/pagination'

interface Props {
  metaData: MetaData
  onPageChange: (page: number) => void
  flexOnMobile?: 'column' | 'row'
}

export default function AppPagination({ metaData, onPageChange, flexOnMobile = 'row' }: Props) {
  const { currentPage, totalCount, totalPages, pageSize } = metaData
  const [pageNumber, setPageNumber] = useState(currentPage)

  function handlePageChange(page: number) {
    setPageNumber(page)
    onPageChange(page)
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: flexOnMobile,
      }}
    >
      <Box sx={{ flexGrow: 0.6, textAlign: 'center' }}>
        <Typography variant='subtitle2' fontSize={'16px'} >
          Displaying {(currentPage - 1) * pageSize + 1} through{' '}
          {currentPage * pageSize > totalCount ? totalCount : currentPage * pageSize} of{' '}
          {totalCount} items
        </Typography>
      </Box>
      <Pagination
        sx={{ color: (theme) => theme.palette.neutral.dark }}
        size='medium'
        variant='outlined'
        count={totalPages}
        page={pageNumber}
        onChange={(e, page) => handlePageChange(page)}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              '&.Mui-selected': {
                backgroundColor: (theme) => theme.palette.neutral.main,
                color: (theme) => theme.palette.neutral.contrastText,
              },
            }}
          />
        )}
      />
    </Box>
  )
}
