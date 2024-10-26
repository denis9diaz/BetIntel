import React, { useEffect, useState } from "react";
import { FaTrophy } from 'react-icons/fa';
import { Link } from "react-router-dom";

const Ranking = () => {
    const [rankings, setRankings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/rankings`);
                if (response.ok) {
                    const data = await response.json();
                    setRankings(data);
                } else {
                    const errorData = await response.json();
                    console.error("Error al obtener el ranking:", errorData.msg);
                }
            } catch (error) {
                console.error("Error en la solicitud fetch:", error);
            }
        };

        fetchRankings();
    }, []);

    const indexOfLastUser = currentPage * usersPerPage;

    const indexOfFirstUser = indexOfLastUser - usersPerPage;

    const currentUsers = rankings.slice(indexOfFirstUser, indexOfLastUser);

    const nextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    console.log("currentUsers:", currentUsers); 

    return (
        <div className="ranking ">
            <h1 className="ranking-title">Ranking de Pronosticadores</h1>
            <table className="rankings-table">
                <thead>
                    <tr className="rankings-header">
                        <th>Posición</th>
                        <th>Usuario</th>
                        <th>Unidades de Beneficio</th>
                        <th>Yield</th>
                        <th>Ver más</th>
                        <th>Contratar</th>
                    </tr>
                </thead>
                <tbody className="rankings-data">
                    {currentUsers.map((user, index) => {
                        const position = indexOfFirstUser + index + 1;
                        const isTopRank = currentPage === 1 && index < 3;
                        return (
                            <tr key={user.user_id} className={isTopRank ? 'top-rank' : ''}>
                                <td>{position}</td>
                                <td>
                                    {user.username}
                                    {isTopRank && (
                                        <span className="cup-icon" style={{ fontSize: index === 0 ? '2rem' : index === 1 ? '1.5rem' : '1.2rem', color: 'black' }}>
                                            <FaTrophy />
                                        </span>
                                    )}
                                </td>
                                <td>{user.profit_units !== null ? parseFloat(user.profit_units).toFixed(2) : 'N/A'}</td>
                                <td>{user.yield_percentage !== null ? parseFloat(user.yield_percentage).toFixed(2) + '%' : 'N/A'}</td>
                                <td><button className="button"><Link to={`/user/${user.user_id}`} className="link-user">Ver más</Link></button></td>
                                <td><button className="button">Contratar</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button className="button-pag" onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
                <span className="span-pag" style={{ margin: '0 1rem' }}>Página {currentPage}</span>
                <button className="button-pag" onClick={nextPage} disabled={indexOfLastUser >= rankings.length}>Siguiente</button>
            </div>
        </div>
    );
};

export default Ranking;
