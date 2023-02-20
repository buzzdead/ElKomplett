import { Box, Typography, Pagination } from '@mui/material'
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
      display='flex'
      alignItems='center'
      flexDirection={flexOnMobile}
      sx={{ placeContent: 'flex-end' }}
    >
      <Typography>
        Displaying {(currentPage - 1) * pageSize + 1} -
        {currentPage * pageSize > totalCount ? totalCount : currentPage * pageSize} of {totalCount}{' '}
        items
      </Typography>
      <Pagination
        color='secondary'
        size='large'
        count={totalPages}
        page={pageNumber}
        onChange={(e, page) => handlePageChange(page)}
      />
    </Box>
  )
}
