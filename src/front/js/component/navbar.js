import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../store/appContext";
import pronostico from "/src/front/img/pronostico.png";
import lista from "/src/front/img/lista.png";
import estadisticas from "/src/front/img/estadisticas.png";
import ranking from "/src/front/img/ranking.png";
import logo from "/src/front/img/logo.png";

export const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: null, photo: null });
    const { store, actions } = useContext(Context);

    const handleLogout = () => {
        localStorage.removeItem("jwt-token");
        setUser({ username: null, photo: null });
        navigate("/");
    };

    useEffect(() => {
        const token = localStorage.getItem("jwt-token");
        if (token) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/current-user`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    if (data.username) {
                        setUser({ username: data.username, photo: data.photo });
                    } else {
                        setUser({ username: null, photo: null });
                    }
                } catch (error) {
                    console.error(error);
                    setUser({ username: null, photo: null });
                }
            };
            fetchUserData();
        }
    }, [localStorage.getItem("jwt-token"), store.infoUpdated]);

    return (
        <nav className="navbar-custom navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid row">
                <div className="logo-name-navbar col-1">
                    <Link to="/"><img src={logo} alt="logo" className="logo-nav"/></Link>
                </div>
                <div className="boton-toggler col-auto ms-auto" style={{ marginRight: '5%' }}>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"><i className="fa-solid fa-bars"></i></span>
                    </button>
                </div>
                <div className="collapse navbar-collapse col-10" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item me-5">
                            <Link to="/newbet" className="navbar-brand h1" title="nuevoPronostico"><img src={pronostico} alt="pronostico" className="icono-nav"/>Nuevo Pronóstico</Link>
                        </li>
                        <li className="nav-item me-5">
                            <Link to="/mybets" className="navbar-brand h1" title="misApuestas"><img src={lista} alt="lista" className="icono-nav"/>Mis Apuestas</Link>
                        </li>
                        <li className="nav-item me-5">
                            <Link to="/stats" className="navbar-brand h1" title="stats"><img src={estadisticas} alt="estadisticas" className="icono-nav"/>Estadísticas</Link>
                        </li>
                        <li className="nav-item me-5">
                            <Link to="/ranking" className="navbar-brand h1" title="stats"><img src={ranking} alt="ranking" className="icono-nav"/>Ranking</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {user.username ? (
                            <li className="nav-item dropdown">
                                <button className="btn btn-link text-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                    {user.username}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <li><Link className="dropdown-item" to="/profile">Mi perfil</Link></li>
                                    <li><button className="dropdown-item logout" onClick={handleLogout}>Cerrar sesión</button></li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item d-flex align-items-center">
                                <Link to="/register" className="nav-link">
                                    <button className="btn btn-success boton-navbar">Registro</button>
                                </Link>
                                <Link to="/login" className="nav-link btn-link text-success boton-navbar">Iniciar sesión</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};
