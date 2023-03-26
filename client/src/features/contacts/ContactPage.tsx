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
          Contact Us
        </Typography>
        <Typography variant="subtitle1">
          Have any questions or concerns? Please fill out the form below, and we'll get back to you as soon as possible.
        </Typography>
      </FormContainer>
      <Box mt={4}>
        <Form noValidate autoComplete="off">
          <FormTextField
            label="Full Name"
            variant="outlined"
            required
          />
          <FormTextField
            label="Email Address"
            variant="outlined"
            required
          />
          <FormTextField
            label="Message"
            variant="outlined"
            multiline
            rows={6}
            required
          />
          <SubmitButton
            variant="contained"
            color="primary"
          >
            Send Message
          </SubmitButton>
        </Form>
      </Box>
    </Container>
  );
};

export default ContactPage;
