import React, { useState } from 'react';
import '../styles/components.css';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{success?: boolean; message?: string} | null>(null);

  // Security: Input validation patterns
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Security: Input sanitization function
  const sanitizeInput = (input: string): string => {
    // Basic sanitization - in a real app, use a library like DOMPurify
    return input
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Security: Validate all inputs before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Security: Sanitize all inputs before sending
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        message: sanitizeInput(formData.message)
      };

      // Simulated API call - would include CSRF token in a real implementation
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Security: Include CSRF token
      //     'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      //   },
      //   body: JSON.stringify(sanitizedData)
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to send message');
      // }

      // Simulation for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success handling
      setSubmitResult({
        success: true,
        message: 'Your message has been sent successfully!'
      });

      // Reset form on success
      setFormData({
        name: '',
        email: '',
        message: ''
      });

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitResult({
        success: false,
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <div className="container">
        <h2 id="contact-heading" className="section-title">Get in Touch</h2>
        <p className="section-subtitle">Have questions about our GenAI solutions? Contact us!</p>

        <div className="contact-form-container">
          <form
            className="contact-form"
            onSubmit={handleSubmit}
            // Security: Add novalidate to handle validation with JS instead
            noValidate
          >
            {/* Security: Show form status messages */}
            {submitResult && (
              <div className={`form-message ${submitResult.success ? 'success' : 'error'}`}
                   role="alert"
                   aria-live="polite">
                {submitResult.message}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={errors.name ? "true" : "false"}
                required
                // Security: Input length limitation
                maxLength={100}
              />
              {errors.name && (
                <span id="name-error" className="error-message">{errors.name}</span>
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
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={errors.email ? "true" : "false"}
                required
                // Security: Pattern for basic email validation
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                maxLength={150}
              />
              {errors.email && (
                <span id="email-error" className="error-message">{errors.email}</span>
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
                aria-describedby={errors.message ? "message-error" : undefined}
                aria-invalid={errors.message ? "true" : "false"}
                required
                maxLength={1000}
              ></textarea>
              {errors.message && (
                <span id="message-error" className="error-message">{errors.message}</span>
              )}
            </div>

            <div className="form-group privacy-consent">
              <input type="checkbox" id="privacy-consent" required />
              <label htmlFor="privacy-consent">
                I agree to the <a href="/privacy-policy">Privacy Policy</a> and consent to the processing of my data.
              </label>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                aria-busy={isSubmitting ? "true" : "false"}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>

            {/* Security: Add honeypot field to prevent spam */}
            <div className="honeypot-field" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input type="text" id="website" name="website" tabIndex={-1} />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
