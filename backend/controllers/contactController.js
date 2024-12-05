exports.handleContactForm = async (req, res) => {
    const { name, email, message } = req.body;
  
    // Save to database or send an email
    try {
      // Simulate saving to DB or sending email
      console.log({ name, email, message });
      res.status(200).json({ success: true, message: 'Form submitted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error submitting form' });
    }
  };
  