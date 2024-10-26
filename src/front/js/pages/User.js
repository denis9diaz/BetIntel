import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const User = () => { 
    const [userData, setUserData] = useState({});
    const [userStats, setUserStats] = useState(null);
    const { id } = useParams();

    useEffect(() => {

        const fetchUserDataAndStats = async () => {
            try {
                const responseUser = await fetch(`${process.env.BACKEND_URL}/api/user/${id}`, {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" },
                });

                if (responseUser.ok) {
                    const userData = await responseUser.json();
                    setUserData(userData.user);
                } else {
                    console.error("Error al obtener los datos del usuario:", responseUser.statusText);
                }

                const responseStats = await fetch(`${process.env.BACKEND_URL}/api/stats/user/${id}`, {
                    method: 'GET',
                   headers: { "Content-Type": "application/json" },
                });

                if (responseStats.ok) {
                    const statsData = await responseStats.json();
                    setUserStats(statsData.stats);
                } else {
                    console.error("Error al obtener las estadísticas del usuario:", responseStats.statusText);
                }
            } catch (error) {
                console.error("Error en la solicitud fetch:", error);
            }
        };

        fetchUserDataAndStats();
    }, [id]);

    return (
        <div className="profile">
            <div className="profile-data">
                <img src={userData && userData.photo ? userData.photo : "https://st.depositphotos.com/1537427/3571/v/450/depositphotos_35717211-stock-illustration-vector-user-icon.jpg"} alt="Profile" className="photo-user" />
                <p className="user-username">{userData.username}</p>
            </div>
            {userStats && (
                <div className="profile-stats">
                    <div className="stats-details">
                        <div className="table">
                            <h2 className="h2-stats">Principales</h2>
                            <table className="table-stats">
                                <tbody>
                                    <tr className="tr-stats">
                                        <td className="td-stats">Unidades de beneficio</td>
                                        <td className="td-stats">{userStats.profit_units ? parseFloat(userStats.profit_units).toFixed(2) : ''}</td>
                                    </tr>
                                    <tr className="tr-stats">
                                        <td className="td-stats">Yield</td>
                                        <td className="td-stats">{userStats.yield_percentage !== null ? parseFloat(userStats.yield_percentage).toFixed(2) + '%' : 'N/A'}</td>
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
                                        <td className="td-stats">{userStats.unit_value ? parseFloat(userStats.unit_value).toFixed(2) : ''}€</td>
                                    </tr>
                                    <tr className="tr-stats">
                                        <td className="td-stats">Dinero apostado</td>
                                        <td className="td-stats">{userStats.money_bet ? parseFloat(userStats.money_bet).toFixed(2) : ''}€</td>
                                    </tr>
                                    <tr className="tr-stats">
                                        <td className="td-stats">Dinero obtenido</td>
                                        <td className="td-stats">{userStats.money_won ? parseFloat(userStats.money_won).toFixed(2) : ''}€</td>
                                    </tr>
                                    <tr className="tr-stats">
                                        <td className="td-stats">Beneficio</td>
                                        <td className="td-stats">{userStats.profit ? parseFloat(userStats.profit).toFixed(2) : ''}€</td>
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
                                        <td className="td-stats">{userStats.total_bets}</td>
                                    </tr>
                                    <tr className="tr-stats">
                                        <td className="td-stats">Apuestas ganadas</td>
                                        <td className="td-stats">{userStats.wins}</td>
                                    </tr>
                                    <tr className="tr-stats">
                                        <td className="td-stats">Apuestas falladas</td>
                                        <td className="td-stats">{userStats.losses}</td>
                                    </tr>
                                    <tr className="tr-stats">
                                        <td className="td-stats">Apuestas nulas</td>
                                        <td className="td-stats">{userStats.draws}</td>
                                    </tr>
                                    <tr className="tr-stats">
                                        <td className="td-stats">Porcentaje de acierto</td>
                                        <td className="td-stats">{userStats.success_rate ? parseFloat(userStats.success_rate).toFixed(2) + '%' : ''}</td>
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
                                        <td className="td-stats">{userStats.average_odds ? parseFloat(userStats.average_odds).toFixed(2) : ''}</td>
                                    </tr>
                                    <tr className="tr-stats">
                                        <td className="td-stats">Stake promedio</td>
                                        <td className="td-stats">{userStats.average_stake ? parseFloat(userStats.average_stake).toFixed(2) : ''}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;
