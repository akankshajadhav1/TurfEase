import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import "../style/ContactUs.css"; // Import the new CSS

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Show success message
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);

    // Clear form fields
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div>
      <div className="bg">
        <div className="contact-container">
          {showToast && (
            <Alert variant="success" className="text-center">
              ✅ We have received your message. Thank you for reaching out!
            </Alert>
          )}
          <div className="contact-card">
            <h2 className="text-center mb-4">Contact Us</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name" className="mb-3 w-3 h-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="email" className="mb-3 ">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="subject" className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="message" className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Send Message
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
