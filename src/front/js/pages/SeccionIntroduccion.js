import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faClock, faCalculator, faChartLine, faPercentage, faMoneyBillWave, faDollarSign, faMoneyCheckAlt, faStream, faCheckCircle, faTachometerAlt, faHandHoldingUsd, faTrophy, faUserFriends, faCheck } from '@fortawesome/free-solid-svg-icons';
import fondosection from '/src/front/img/fondo-section.png'


const SeccionIntroduccion = () => {
    return (
        <div className="introduction-section">
            <section className="home-header">
                <div className="container-intro">
                    <h1 className="titulo-home">PLATAFORMA ESTADISTICA DE APUESTAS DEPORTIVAS</h1>
                    <h2 className="home-subtitle">Lleva un control exhaustivo de tus apuestas y mejora tus resultados con nuestras herramientas</h2>
                </div>
            </section>
            <section className="home-introduction">
                <div className="container">
                    <div className="intro-section">
                        <div className="intro-section-left" style={{
                            position: 'relative',
                            padding: '3rem',
                            minHeight: "30vh",
                            borderRadius: '10px',
                            backgroundImage: `url(${fondosection})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}>
                            <h2 className="what-title">¿Qué puedes hacer aquí?</h2>
                            <h5 className="what-subtitle">Contratar pronosticadores</h5>
                            <ul className="introduction-list">
                                <li><FontAwesomeIcon className="icon" icon={faCheck} /><span className="what-item">Accede al Ranking de pronosticadores</span></li>
                                <li><FontAwesomeIcon className="icon" icon={faCheck} /><span className="what-item">Busca el pronosticador que más te guste</span></li>
                                <li><FontAwesomeIcon className="icon" icon={faCheck} /><span className="what-item">Accede a sus estadísticas detalladas</span></li>
                                <li><FontAwesomeIcon className="icon" icon={faCheck} /><span className="what-item">Contrata sus servicios y ganad dinero juntos</span></li>
                            </ul>
                            <h5 className="what-subtitle-2">Como pronosticador</h5>
                            <ul className="introduction-list">
                                <li><FontAwesomeIcon className="icon" icon={faCheck} /><span className="what-item">Crea y gestiona pronósticos de manera eficiente</span></li>
                                <li><FontAwesomeIcon className="icon" icon={faCheck} /><span className="what-item">Accede a una lista detallada de tus apuestas</span></li>
                                <li><FontAwesomeIcon className="icon" icon={faCheck} /><span className="what-item">Accede a todas tus estadísticas</span></li>
                                <li><FontAwesomeIcon className="icon" icon={faCheck} /><span className="what-item">Compite por ser el mejor pronosticador</span></li>
                            </ul>
                        </div>
                        <div className="intro-section-right" style={{
                            background: `rgba(255, 255, 255, 0.2) url(${fondosection})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            padding: '3rem',
                            minHeight: "30vh",
                            borderRadius: '10px',
                        }}>
                            <h2 className="how-title">Para Pronosticadores</h2>
                            <ol className="how-it-works-list">
                                <li><FontAwesomeIcon className="icon" icon={faListAlt} /><span className="how-list-item">Añade tus pronósticos</span></li>
                                <li><FontAwesomeIcon className="icon" icon={faClock} /><span className="how-list-item">Espera a que se determine el resultado</span></li>
                                <li>
                                    <FontAwesomeIcon className="icon" icon={faCalculator} /><span className="how-list-item">Automáticamente se te calcularán:</span>
                                    <ul className="sub-stats-list">
                                        <li><FontAwesomeIcon className="sub-icon" icon={faChartLine} /><span className="sub-stats-item">Unidades de beneficio</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faPercentage} /><span className="sub-stats-item">Yield</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faMoneyBillWave} /><span className="sub-stats-item">Dinero apostado</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faDollarSign} /><span className="sub-stats-item">Dinero obtenido</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faMoneyCheckAlt} /><span className="sub-stats-item">Beneficio</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faStream} /><span className="sub-stats-item">Total de apuestas (Win, Lost, Push)</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faCheckCircle} /><span className="sub-stats-item">Porcentaje de acierto</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faTachometerAlt} /><span className="sub-stats-item">Cuota promedio</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faHandHoldingUsd} /><span className="sub-stats-item">Stake promedio</span></li>
                                    </ul>
                                </li>
                                <li><FontAwesomeIcon className="icon" icon={faTrophy} /><span className="how-list-item">Posicionate en el ranking de pronosticadores</span></li>
                                <li><FontAwesomeIcon className="icon" icon={faUserFriends} /><span className="how-list-item">Los usuarios podrán contratar tus servicios</span></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default SeccionIntroduccion
