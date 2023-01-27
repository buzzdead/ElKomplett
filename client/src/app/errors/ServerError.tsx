import { Button, Container, Divider, Paper, Typography, Box } from "@mui/material"
import React from 'react'
import { useHistory, useLocation } from "react-router-dom"

export default function ServerError() {
    const history = useHistory()
    const {state} = useLocation<any>()
    return (
        <Container component={Paper}>
            {state.error && state.error ? (
                <Box>
                <Typography variant='h3' color='error' gutterBottom>{state.error.title}</Typography>
                <Divider />
                <Typography>{state.error.detail || 'Internal server error'}</Typography>
                </Box>
            ) :
            <Typography variant='h5' gutterBottom>Server error</Typography>
        
    }
    <Button onClick={() => history.push('/catalog')}> Go back to the store </Button>
    </Container>
    )
}