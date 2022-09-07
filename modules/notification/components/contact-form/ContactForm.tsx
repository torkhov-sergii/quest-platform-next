import React, { useEffect, useState } from 'react';
import { initializeApollo } from '@services/graphql/conf/apollo';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useMutation } from '@apollo/client';
import { sendContactForm } from '@modules/notification/graphql';
import { validateEmail } from '../../../../src/helpers/validation';

type Props = {};

const ContactForm: React.FC<Props> = ({}) => {
  const { i18n } = useTranslation();

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [handleSubmit, { data: submitData, loading: submitLoading, error: submitError }] = useMutation(sendContactForm);

  const submit = () => {
    handleSubmit({
      client: initializeApollo(i18n.language),
      variables: {
        email: email,
        name: name,
        phone: phone,
        message: message,
      },
    });
  };

  useEffect (() => {
    // Your code to triggered when we get the data from graphql
    if (submitData){
      setName('')
      setPhone('')
      setEmail('')
      setMessage('')
    }
  }, [submitData])

  return (
    <>
      <TextField required={true} label="Name" variant="outlined" value={name} onChange={(event) => setName(event.target.value)} />
      <TextField required={true} label="Phone" variant="outlined" value={phone} onChange={(event) => setPhone(event.target.value)} />
      <TextField required={true} label="Email" variant="outlined" value={email} onChange={(event) => setEmail(event.target.value)} />
      <TextField required={true} multiline rows={4} label="Message" variant="outlined" value={message} onChange={(event) => setMessage(event.target.value)} />

      <Button variant="contained" onClick={() => submit()} disabled={!name || !phone || !validateEmail(email) || !message || submitLoading}>
        {submitLoading ? 'Submitting...' : 'Submit'}
      </Button>

      {submitData && <p>Thanks for contacting us!</p>}
    </>
  );
};

export default ContactForm;
