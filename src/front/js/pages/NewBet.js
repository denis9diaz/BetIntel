import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const NewBet = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt-token");
        if (!token) {
            navigate("/login");
        } else {
            actions.getMyTasks();
        }
    }, [navigate, actions]);

    const [newBet, setNewBet] = useState({
        event_date: "",
        event_name: "",
        prediction: "",
        odds: "",
        amount_bet: "",
        stake: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBet(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("jwt-token");
            const response = await fetch(`${process.env.BACKEND_URL}/api/pronostico`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newBet)
            });
            if (response.ok) {
                setNewBet({
                    event_date: "",
                    event_name: "",
                    prediction: "",
                    odds: "",
                    amount_bet: "",
                    stake: "" 
                });
                console.log('Apuesta agregada exitosamente');
                Swal.fire("¡Apuesta registrada!", "La apuesta se ha registrado satisfactoriamente", "success").then(() => {
                    navigate("/mybets");
                });
            } else {
                const errorData = await response.json();
                console.error("Error al agregar la apuesta:", errorData.message);
                Swal.fire("Error", errorData.message || "Error al agregar la apuesta", "error");
            }
        } catch (error) {
            console.error("Error en la solicitud fetch:", error);
            Swal.fire("Error", "Error al registrar la apuesta", "error").then(() => {
            });
        }
    };    

    return (
        <div className="new-bet-container">
            <h1 className="new-bet-title">Añadir nuevo pronóstico</h1>
            <div className="new-bet-form-container">
                <form onSubmit={handleSubmit} className="new-bet-form">
                    <div className="form-group">
                        <label>Fecha del evento</label>
                        <input
                            type="date"
                            name="event_date"
                            value={newBet.event_date}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Evento</label>
                        <input
                            type="text"
                            name="event_name"
                            value={newBet.event_name}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Predicción</label>
                        <input
                            type="text"
                            name="prediction"
                            value={newBet.prediction}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Cuota</label>
                        <input
                            type="text"
                            name="odds"
                            value={newBet.odds}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Cantidad Apostada</label>
                        <input
                            type="number"
                            name="amount_bet"
                            value={newBet.amount_bet}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Stake</label>
                        <input
                            type="number"
                            name="stake"
                            value={newBet.stake}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="submit-button">Registrar Apuesta</button>
                </form>
            </div>
        </div>
    );
}

export default NewBet;
