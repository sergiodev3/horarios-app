import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <h3>Sistema de Horarios</h3>
            <p>Gestión académica inteligente</p>
          </div>
        </div>

        <div className="footer-section">
          <h4>Funcionalidades</h4>
          <ul>
            <li>Gestión de Maestros</li>
            <li>Administración de Materias</li>
            <li>Control de Grupos</li>
            <li>Creación de Horarios</li>
            <li>Exportación a PDF</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Información</h4>
          <ul>
            <li>Versión 1.0.0</li>
            <li>Desarrollado con React & Node.js</li>
            <li>Base de datos PostgreSQL</li>
            <li>Diseño responsivo</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Soporte</h4>
          <ul>
            <li>Reportar problemas o Sugerencias</li>
            <li>Contacto maestro.sergio.sanchez3@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} Sistema de Horarios. Todos los derechos reservados.</p>
          <div className="footer-links">
            <span>Desarrollado por Sergio Homero Sanchez Castillo</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;