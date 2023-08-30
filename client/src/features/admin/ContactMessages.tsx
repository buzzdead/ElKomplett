import { Box, Button, Typography } from '@mui/material'
import agent from 'app/api/agent'
import { useEffect, useState } from 'react'

interface Props {
    onClose: () => void
}

export const ContactMessages = ({onClose}: Props) => {
  const [messages, setMessages] = useState<{ email: string; message: string; name: string }[]>()
  const getMessages = async () => {
    const msgs = await agent.Admin.getMessages()
    setMessages(msgs)
  }
  useEffect(() => {
    getMessages()
  }, [])
  return (
    <div>
    <div style={{gap: 5, display: 'flex', flexDirection: 'row'}}>
      {messages?.map((e) => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
             <Typography>{e.name}</Typography>
             <Typography>{e.email}</Typography>
            <Typography>{e.message}</Typography>
          </Box>
        )
      })}
      </div>
      <Button onClick={onClose} >Go back</Button>
    
    </div>
  )
}
