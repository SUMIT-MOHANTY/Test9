import React, { useState } from 'react';
import { ContactFormProps, ContactFormData } from '../types';

const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  isSubmitting = false,
  submitError = null,
  submitSuccess = false,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      message: '',
    };

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      try {
        await onSubmit(formData);
        // Clear form after successful submission
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      } catch (error) {
        // Error handling is managed by parent component
      }
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2>Contact Us</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={!!formErrors.name}
              aria-describedby={formErrors.name ? "nameError" : undefined}
            />
            {formErrors.name && (
              <p id="nameError" className="error-message">
                {formErrors.name}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={!!formErrors.email}
              aria-describedby={formErrors.email ? "emailError" : undefined}
            />
            {formErrors.email && (
              <p id="emailError" className="error-message">
                {formErrors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              disabled={isSubmitting}
              aria-invalid={!!formErrors.message}
              aria-describedby={formErrors.message ? "messageError" : undefined}
            ></textarea>
            {formErrors.message && (
              <p id="messageError" className="error-message">
                {formErrors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {submitError && (
            <div className="submit-error">
              <p>{submitError}</p>
            </div>
          )}

          {submitSuccess && (
            <div className="submit-success">
              <p>Thank you! Your message has been sent successfully.</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
