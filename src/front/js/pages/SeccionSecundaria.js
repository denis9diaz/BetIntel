import React from "react";
import { Link } from "react-router-dom";

import pronostico from "/src/front/img/pronostico.png";
import lista from "/src/front/img/lista.png";
import estadisticas from "/src/front/img/estadisticas.png";
import ranking from "/src/front/img/ranking.png";

const SeccionSecundaria = () => {
    return (
        <div className="seccion-secundaria">
            <section className="home-new-bet">
                <div className="container">
                    <h2 className="pron-title">Crea un nuevo pronóstico</h2>
                    <Link to="/newbet" className="navbar-brand h1" title="nuevoPronostico">
                        <img src={pronostico} alt="pronostico" className="icono-section" />
                    </Link>
                </div>
            </section>
            <section className="home-my-bets"> 
                <div className="container">
                    <h2 className="bet-title">Mis Apuestas</h2>
                    <Link to="/mybets" className="navbar-brand h1" title="misApuestas">
                        <img src={lista} alt="misApuestas" className="icono-section" />
                    </Link>
                </div>
            </section>
            <section className="home-stats">
                <div className="container">
                    <h2 className="stats-title-home">Consulta tus estadísticas</h2>
                    <Link to="/stats" className="navbar-brand h1" title="stats">
                        <img src={estadisticas} alt="estadisticas" className="icono-section" />
                    </Link>
                </div>
            </section>
            <section className="home-top-users">
                <div className="container">
                    <h2 className="rankings-title-home">Mejores pronosticadores</h2>
                    <Link to="/ranking" className="navbar-brand h1" title="stats">
                        <img src={ranking} alt="ranking" className="icono-section" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default SeccionSecundaria;
