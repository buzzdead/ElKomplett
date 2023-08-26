import React from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';

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
        <Form noValidate autoComplete="off">
          <FormTextField
            label="Fullt navn"
            variant="outlined"
            required
          />
          <FormTextField
            label="E-postadresse"
            variant="outlined"
            required
          />
          <FormTextField
            label="Beskjed"
            variant="outlined"
            multiline
            rows={6}
            required
          />
          <SubmitButton
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
