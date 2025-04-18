import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import NavBar from '../Components/NavBar';
import axios from 'axios';
import '../Styles/ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: '',
  });

  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    // Validation de base
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // Remplacez par l'URL de votre API
      await axios.post('http://localhost:3000/api/contact', formData);
      
      // Réinitialiser le formulaire et afficher un message de succès
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: '',
      });
      setValidated(false);
      setAlert({
        show: true,
        variant: 'success',
        message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
      });

      // Masquer l'alerte après 5 secondes
      setTimeout(() => {
        setAlert({ show: false, variant: '', message: '' });
      }, 5000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setAlert({
        show: true,
        variant: 'danger',
        message: 'Une erreur s\'est produite lors de l\'envoi du message. Veuillez réessayer plus tard.',
      });
    }
  };

  return (
    <div className="contact-page">
      <NavBar />
      <div className="contact-header">
        <Container>
          <h1>Contactez-nous</h1>
          <p>Vous avez des questions ou besoin d'informations ? N'hésitez pas à nous contacter !</p>
        </Container>
      </div>

      <Container className="mt-5">
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({...alert, show: false})} dismissible>
            {alert.message}
          </Alert>
        )}

        <Row className="mb-5">
          <Col md={4} className="mb-4 mb-md-0">
            <Card className="contact-info-card h-100">
              <Card.Body>
                <h3 className="mb-4">Informations de contact</h3>
                
                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <div>
                    <h5>Adresse</h5>
                    <p>46 Rue Faidherbe <br />59350 Lille, France</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <div>
                    <h5>Téléphone</h5>
                    <p>01 23 45 67 89</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <div>
                    <h5>Email</h5>
                    <p>contact@enigmes-evadees.fr</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <FaClock className="contact-icon" />
                  <div>
                    <h5>Horaires d'ouverture</h5>
                    <p>Lun - Dim: 9h - Minuit</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={8}>
            <Card className="contact-form-card">
              <Card.Body>
                <h3 className="mb-4">Envoyez-nous un message</h3>
                
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Veuillez saisir votre nom.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                          type="text"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Veuillez saisir votre prénom.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Veuillez saisir une adresse email valide.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Téléphone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Sujet</Form.Label>
                    <Form.Control
                      as="select"
                      name="sujet"
                      value={formData.sujet}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="reservation">Réservation</option>
                      <option value="information">Demande d'information</option>
                      <option value="reclamation">Réclamation</option>
                      <option value="partenariat">Proposition de partenariat</option>
                      <option value="autre">Autre</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Veuillez sélectionner un sujet.
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Veuillez saisir votre message.
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Button variant="primary" type="submit" size="lg">
                    Envoyer
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Ajouter une Google Map */}
        <Card className="mb-5">
          <Card.Body>
            <h3 className="mb-4 text-center">Comment nous trouver</h3>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.991440608529!2d2.2922926156743825!3d48.858373579287475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1650356124128!5m2!1sfr!2sfr"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Notre emplacement"
              ></iframe>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ContactPage;