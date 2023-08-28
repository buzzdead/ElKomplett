import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';
import agent from 'app/api/agent';

const FormContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
}));

const Form = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const FormTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: '100%',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async () => {
    const res = await agent.Admin.sendEmail(formData)
    console.log(res)

  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Container maxWidth="sm">
      <FormContainer>
        <Typography variant="h4" gutterBottom>
          Kontakt oss
        </Typography>
        <Typography variant="subtitle1">
          Har du noen spørsmål eller tilbakemeldinger? Vennligst fyll ut skjemaet nedenfor, så kommer vi tilbake til deg så snart som mulig.
        </Typography>
      </FormContainer>
      <Box mt={4}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <FormTextField
            label="Fullt navn"
            variant="outlined"
            required
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <FormTextField
            label="E-postadresse"
            variant="outlined"
            required
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <FormTextField
            label="Beskjed"
            variant="outlined"
            multiline
            rows={6}
            required
            name="message"
            value={formData.message}
            onChange={handleInputChange}
          />
          <SubmitButton
            type="submit"
            variant="contained"
            color="primary"
          >
            Send beskjed
          </SubmitButton>
        </Form>
      </Box>
    </Container>
  );
};

export default ContactPage;
