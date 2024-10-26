import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const Stats = () => {
    const [stats, setStats] = useState(null);
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

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const token = localStorage.getItem("jwt-token");
                const response = await fetch(`${process.env.BACKEND_URL}/api/stats/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data.stats);
                } else {
                    console.error("Error al obtener las estadísticas del usuario");
                }
            } catch (error) {
                console.error("Error en la solicitud fetch:", error);
            }
        };

        fetchUserStats();
    }, []);

    return (
        <div className="stats">
            <h1 className="stats-title">Estadísticas</h1>
            {stats && (
                <div className="stats-details">
                    <div className="table">
                        <h2 className="h2-stats">Principales</h2>
                        <table className="table-stats">
                            <tbody>
                                <tr className="tr-stats">
                                    <td className="td-stats">Unidades de beneficio</td>
                                    <td className="td-stats">{stats.profit_units ? parseFloat(stats.profit_units).toFixed(2) : ''}</td>
                                </tr>
                                <tr className="tr-stats">
                                    <td className="td-stats">Yield</td>
                                    <td className="td-stats">{stats.yield_percentage !== null ? parseFloat(stats.yield_percentage).toFixed(2) + '%' : 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="table">
                        <h2 className="h2-stats">€</h2>
                        <table className="table-stats">
                            <tbody>
                                <tr className="tr-stats">
                                    <td className="td-stats">Valor de la unidad</td>
                                    <td className="td-stats">{stats.unit_value ? parseFloat(stats.unit_value).toFixed(2) : ''}€</td>
                                </tr>
                                <tr className="tr-stats">
                                    <td className="td-stats">Dinero apostado</td>
                                    <td className="td-stats">{stats.money_bet ? parseFloat(stats.money_bet).toFixed(2) : ''}€</td>
                                </tr>
                                <tr className="tr-stats">
                                    <td className="td-stats">Dinero obtenido</td>
                                    <td className="td-stats">{stats.money_won ? parseFloat(stats.money_won).toFixed(2) : ''}€</td>
                                </tr>
                                <tr className="tr-stats">
                                    <td className="td-stats">Beneficio</td>
                                    <td className="td-stats">{stats.profit ? parseFloat(stats.profit).toFixed(2) : ''}€</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="table">
                        <h2 className="h2-stats">Apuestas</h2>
                        <table className="table-stats">
                            <tbody>
                                <tr className="tr-stats">
                                    <td className="td-stats">Total de apuestas</td>
                                    <td className="td-stats">{stats.total_bets}</td>
                                </tr>
                                <tr className="tr-stats">
                                    <td className="td-stats">Apuestas ganadas</td>
                                    <td className="td-stats">{stats.wins}</td>
                                </tr>
                                <tr className="tr-stats">
                                    <td className="td-stats">Apuestas falladas</td>
                                    <td className="td-stats">{stats.losses}</td>
                                </tr>
                                <tr className="tr-stats">
                                    <td className="td-stats">Apuestas nulas</td>
                                    <td className="td-stats">{stats.draws}</td>
                                </tr>
                                <tr className="tr-stats">
                                    <td className="td-stats">Porcentaje de acierto</td>
                                    <td className="td-stats">{stats.success_rate ? parseFloat(stats.success_rate).toFixed(2) + '%' : ''}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="table">
                        <h2 className="h2-stats">Promedios</h2>
                        <table className="table-stats">
                            <tbody>
                                <tr className="tr-stats">
                                    <td className="td-stats">Cuota promedio</td>
                                    <td className="td-stats">{stats.average_odds ? parseFloat(stats.average_odds).toFixed(2) : ''}</td>
                                </tr>
                                <tr className="tr-stats">
                                    <td className="td-stats">Stake promedio</td>
                                    <td className="td-stats">{stats.average_stake ? parseFloat(stats.average_stake).toFixed(2) : ''}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Stats;
