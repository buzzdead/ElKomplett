import { Button, Container, Divider, Paper, Typography, Box } from "@mui/material"
import React from 'react'
import { useLocation, useNavigate } from "react-router-dom"

export default function ServerError() {
    const navigate = useNavigate()
    const {state} = useLocation()

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
    <Button onClick={() => navigate('/catalog')}> Go back to the store </Button>
    </Container>
    )
}