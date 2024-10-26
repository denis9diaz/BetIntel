import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import fondo from '/src/front/img/fondo-registro.png'

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const isValidPassword = (password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (!isValidEmail(email)) {
            setError("Introduce un email válido");
            return;
        }

        if (!isValidPassword(password)) {
            setError("La contraseña debe contener al menos una mayúscula, una minúscula, un número y 8 caracteres");
            return;
        }

        const resp = await fetch(process.env.BACKEND_URL + "/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "email": email, "password": password, "username": username })
        });

        const data = await resp.json();

        if (resp.status === 400) {
            setError(data.msg);
        } else if (resp.status === 201) {
            setError("");
            Swal.fire({
                title: '¡Registro exitoso!',
                text: 'Serás redirigido al inicio de sesión.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });
        }
    };

    return (
        <div className="registro" style={{ backgroundImage: `url(${fondo})`, backgroundSize: 'cover', backgroundPosition: 'center', paddingTop: '7rem', minHeight: "100vh" }}>
        <div className="auth-container">
            <div className="container form-body">
                <h1 className="title">Crear cuenta</h1>
                <form onSubmit={handleSubmit} className="form-register">
                    {/* Formulario */}
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
                        <label className="label-form" htmlFor="username">Nombre de usuario</label>
                        <input
                            type="text"
                            id="username"
                            className="input-form"
                            placeholder="Introduce tu nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                    <div className="input-group">
                        <label className="label-form" htmlFor="repeatPassword">Repetir contraseña</label>
                        <input
                            type={showRepeatPassword ? "text" : "password"}
                            id="repeatPassword"
                            className="input-form"
                            placeholder="Repite tu contraseña"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                        <div className="password-toggle-icon" onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                            {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                    {error && <div className="error-message mb-4">{error}</div>}
                    <button type="submit" className="btn btn-success">Registro</button>
                </form>
                <p className="mt-3 text-center">
                    ¿Ya tienes una cuenta? <a className="link-register" href="/login">Inicia sesión</a>
                </p>
            </div>
        </div>
        </div>
    );
};

export default Register;
