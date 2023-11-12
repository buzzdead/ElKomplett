import React, { LegacyRef, useRef } from 'react';
import emailjs from '@emailjs/browser';

export const EmailForm = () => {
    const form = useRef<HTMLFormElement>(null);
  
    const sendEmail = (e: React.FormEvent) => {
      e.preventDefault();
  
      if (form.current) {
        const formData = new FormData(form.current);
        console.log(form.current)
  
        emailjs
          .sendForm('service_tmj7xj3', 'template_uzibm0n', form.current, 'ocXtKtxKC4tQL7d8J')
          .then(
            (result) => {
              console.log(result.text);
              console.log('Message sent!');
            },
            (error) => {
              console.log(error.text);
              console.log('Error sending message, try again!');
            }
          );
      }
    };
  
    return (
      <form ref={form} onSubmit={sendEmail}>
        <input name="user_email" type="email" placeholder="Email" required />
        <textarea name="user_message" placeholder="Write message..." required></textarea>
        <button type="submit">Send Message</button>
      </form>
    );
  };