import { Backdrop, Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'

interface Props {
    message?: string
    otherPos?: boolean
}

export default function LoadingComponent({message = 'Loading...', otherPos = false}: Props) {
    return(
        <Backdrop open={true} invisible={true}>
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh' marginTop={otherPos ? 50 : 0}>
                <CircularProgress size={100} color='secondary' />
                <Typography variant='h4' sx={{justifyContent: 'center', position: 'fixed', top: otherPos ? '80%' : '60%'}}>{message}</Typography>
            </Box>
        </Backdrop>
    )

}