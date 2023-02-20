import { Table, TableBody, TableCell, TableCellBaseProps, TableContainer, TableRow, Theme } from '@mui/material'
import {SxProps} from '@mui/system'
import * as React from 'react'

export type TableData = {
    key: string
    value: string | number | undefined
    sx?: SxProps<Theme> | undefined
    dontRender?: boolean
    scope?: string,
    component?: React.ElementType<TableCellBaseProps>
}

interface Props {
    tableData: TableData[]
    sx?: SxProps<Theme> | undefined
    component?: any
}

export default function AppTable({tableData, sx, component}: Props) {

  const renderTableRow = (row: TableData) => {
    return (
      <TableRow>
        <TableCell>{row.key}</TableCell>
        <TableCell component={row.component} scope={row.scope}>{row.value}</TableCell>
      </TableRow>
    )
  }
    return (
      <TableContainer component={component}>
        <Table aria-label='simple table' sx={sx}>
          <TableBody>
            {tableData.map(row => {
               return !row.dontRender && renderTableRow(row)
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  
}