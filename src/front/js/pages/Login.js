import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import campo from '/src/front/img/campo.png'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const sendLogin = async (email, password) => {
        try {
            const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "email": email, "password": password }),
            });

            if (!resp.ok) {
                throw new Error("Problema al iniciar sesión");
            }

            const data = await resp.json();
            localStorage.setItem("jwt-token", data.token);
            navigate("/");
        } catch (error) {
            console.error(error);
            setError("Contraseña incorrecta");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        sendLogin(email, password);
    };

    return (
        <div className="login" style={{ backgroundImage: `url(${campo})`, backgroundSize: 'cover', backgroundPosition: 'center', paddingTop: '5rem', minHeight: "100vh" }}>
            <div className="auth-container-login">
                <div className="container form-body">
                    <h1 className="title">Iniciar sesión</h1>
                    <form onSubmit={handleSubmit} className="form-login">
                        {error && <div className="error-message">{error}</div>}
                        <div className="input-group">
                            <label className="label-form" htmlFor="email">Email</label>
                            <input
                                type="text"
                                id="email"
                                className="input-form"
                                placeholder="Introduce tu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label className="label-form" htmlFor="password">Contraseña</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="input-form"
                                placeholder="Introduce tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success">Entrar</button>
                    </form>
                    <p className="mt-3 text-center">
                        ¿No tienes cuenta? <Link className="link-register" to="/register">Regístrate</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
