import {
  Table,
  TableBody,
  TableCell,
  TableCellBaseProps,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from '@mui/material'
import { SxProps } from '@mui/system'
import * as React from 'react'

export type TableData = {
  key: string
  value: string | number | any | undefined
  dontRender?: boolean
  sx?: SxProps<Theme> | undefined
  scope?: string
  component?: React.ElementType<TableCellBaseProps>
}

interface Props {
  tableData: TableData[][]
  sx?: SxProps<Theme> | undefined
  sxRow?: SxProps<Theme> | undefined
  component?: any
}

export default function AppTable2D({ tableData, sx, component }: Props) {
  const renderTableHeaders = (row: TableData) => {
    return !row.dontRender ? (
      <TableCell sx={row.sx} component={row.component} scope={row.scope} key={'header' + row.key}>
        {row.key}
      </TableCell>
    ) : null
  }
  const renderTableRow = (row: TableData) => {
    return (
      <TableCell sx={row.sx} key={'row' + row.key} >
        {row.value}
      </TableCell>
    )
  }
  const renderTable = (data: TableData[], id: number) => {
    return (
      <TableRow key={id}>
        {data.map((row) => {
          return !row.dontRender && renderTableRow(row)
        })}
      </TableRow>
    )
  }
  return (
    <TableContainer component={component}>
      <Table sx={sx}>
        <TableHead>
          <TableRow>
            {tableData[0] &&
              tableData[0].map((row) => {
                return renderTableHeaders(row)
              })}
          </TableRow>
        </TableHead>
        <TableBody>{tableData.map((data, id) => renderTable(data, id))}</TableBody>
      </Table>
    </TableContainer>
  )
}
