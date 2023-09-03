import { Box, Typography } from '@mui/material'
import agent from 'app/api/agent'
import { useEffect, useState } from 'react'

export const ContactMessages = () => {
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
          <Box key={e.name} sx={{ display: 'flex', flexDirection: 'column', padding: 10 }}>
             <Typography>{e.name}</Typography>
             <Typography>{e.email}</Typography>
            <Typography>{e.message}</Typography>
          </Box>
        )
      })}
      </div>
    </div>
  )
}
