import React from "react";
import { Link } from "react-router-dom";
import logo from "/src/front/img/logoinvertido.png";

const Footer = () => (
    <footer className="footer">
            <div className="row">
                <div className="col-md-3 logo-footer-div">
                    <p><img src={logo} alt="logo" className="logo-footer" /></p>
                </div>
                <div className="col-md-3">
                    <h4>Quienes somos</h4>
                    <p>Descubre más acerca de nuestro propósito</p>
                    <Link to="/about" className="about-us">Sobre nosotros</Link>
                </div>
                <div className="col-md-3">
                    <h4>Contacto</h4>
                    <p><i className="fas fa-map-marker-alt"></i> 123 Calle, Ciudad, País</p>
                    <p><i className="fas fa-envelope"></i> info@betintel.com</p>
                    <p><i className="fas fa-phone-alt"></i> +1234567890</p>
                </div>
                <div className="col-md-3">
                    <h4>Redes Sociales</h4>
                    <ul className="list-inline">
                        <li className="list-inline-item"><a href="https://www.facebook.com"><i className="fab fa-facebook-f"></i></a></li>
                        <li className="list-inline-item"><a href="https://www.twitter.com"><i className="fab fa-twitter"></i></a></li>
                        <li className="list-inline-item"><a href="https://www.instagram.com"><i className="fab fa-instagram"></i></a></li>
                    </ul>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 text-center mt-4">
                    <p>© 2024 BetIntel. Todos los derechos reservados.</p>
                </div>
            </div>
        
    </footer>
);

export default Footer;
