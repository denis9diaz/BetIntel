import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const MyBets = () => {
    const [userBets, setUserBets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [betsPerPage] = useState(10);
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt-token");
        if (!token) {
            navigate("/login");
        } else {
            actions.getMyTasks();
            fetchUserBets();
        }
    }, [navigate, actions]);

    const fetchUserBets = async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            const response = await fetch(`${process.env.BACKEND_URL}/api/bets/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                let bets = await response.json();
                bets.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
                setUserBets(bets);
            } else {
                const errorData = await response.json();
                console.error("Error al obtener las apuestas del usuario:", errorData.msg);
            }
        } catch (error) {
            console.error("Error en la solicitud fetch:", error);
        }
    };

    const getResultClass = (resultado) => {
        switch (resultado) {
            case 'Ganada':
                return 'won';
            case 'Perdida':
                return 'lost';
            case 'Nula':
                return 'void';
            default:
                return '';
        }
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const indexOfLastBet = currentPage * betsPerPage;
    const indexOfFirstBet = indexOfLastBet - betsPerPage;
    const currentBets = userBets.slice(indexOfFirstBet, indexOfLastBet);

    return (
        <div className="my-bet-container">
            <h1 className="my-bet-title">Mis Apuestas</h1>
            <table className="my-bet-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Evento</th>
                        <th>Predicción</th>
                        <th>Cuota</th>
                        <th>Cantidad Apostada</th>
                        <th>Stake</th>
                        <th>Resultado</th>
                        <th>Dinero Obtenido</th>
                        <th>Unidades</th>
                    </tr>
                </thead>
                <tbody>
                    {currentBets.map(bet => (
                        <tr key={bet.id}>
                            <td>{formatDate(bet.event_date)}</td>
                            <td>{bet.event_name}</td>
                            <td>{bet.prediction}</td>
                            <td>{parseFloat(bet.odds).toFixed(2)}</td>
                            <td>{parseFloat(bet.amount_bet).toFixed(2)}€</td>
                            <td>{bet.stake}</td>
                            <td className={getResultClass(bet.resultado)}>{bet.resultado || 'Pendiente'}</td>
                            <td className={getResultClass(bet.resultado)}>{isNaN(parseFloat(bet.result_amount)) ? 'Pendiente' : parseFloat(bet.result_amount).toFixed(2) + '€'}</td>
                            <td className={getResultClass(bet.resultado)}>{isNaN(parseFloat(bet.result_units)) ? 'Pendiente' : parseFloat(bet.result_units).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button className="button-pag" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
                <span className="span-pag" style={{ margin: '0 1rem' }}>Página {currentPage}</span>
                <button className="button-pag" onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastBet >= userBets.length}>Siguiente</button>
            </div>
        </div>
    );
}

export default MyBets;
