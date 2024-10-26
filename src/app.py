import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User, EstadisticasUsuario, Apuestas
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import re

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


def calcular_estadisticas(apuestas): 
    apuestas_con_resultado = [apuesta for apuesta in apuestas if apuesta.resultado is not None and apuesta.odds is not None]

    if not apuestas_con_resultado:
        return None

    money_bet = sum(apuesta.amount_bet for apuesta in apuestas_con_resultado)
    money_won = sum(apuesta.result_amount for apuesta in apuestas_con_resultado if apuesta.resultado == 'Ganada')
    profit_units = sum(apuesta.result_units for apuesta in apuestas_con_resultado if apuesta.result_units is not None)
    
    profit = money_won - money_bet
    played_units = sum(apuesta.stake for apuesta in apuestas_con_resultado)
    yield_percentage = (profit / money_bet) * 100 if money_bet != 0 else None
    total_bets = len(apuestas_con_resultado)
    
    average_odds = sum(apuesta.odds for apuesta in apuestas_con_resultado) / total_bets
    average_stake = played_units / total_bets if total_bets != 0 else None
    unit_value = money_bet / played_units if played_units != 0 else None

    wins = sum(1 for apuesta in apuestas_con_resultado if apuesta.resultado == 'Ganada')
    losses = sum(1 for apuesta in apuestas_con_resultado if apuesta.resultado == 'Perdida')
    draws = sum(1 for apuesta in apuestas_con_resultado if apuesta.resultado == 'Nula')

    success_rate = (wins / total_bets) * 100 if total_bets != 0 else None

    return {
        "money_bet": money_bet,
        "money_won": money_won,
        "profit": profit,
        "played_units": played_units,
        "profit_units": profit_units,
        "yield_percentage": yield_percentage,
        "total_bets": total_bets,
        "wins": wins,
        "losses": losses,
        "draws": draws,
        "success_rate": success_rate,
        "average_odds": average_odds,
        "average_stake": average_stake,
        "unit_value": unit_value
    }


'''------------------------------------ENDPOINTS----------------------------------'''


@app.route('/api/register', methods=['POST'])
def register():
    body = request.get_json(silent = True)
    if body is None:
        return jsonify({'msg': "Debes enviar información en el body"}), 400
    if 'email' not in body or body["email"] == "":
        return jsonify({'msg': "El campo email es obligatorio"}), 400
    if not re.match(r'\S+@\S+\.\S+', body['email']):
        return jsonify({'msg': "Introduce un email válido"}), 400
    if "username" not in body or body["username"] == "":
        return jsonify({"msg": "El campo username es obligatorio"}), 400
    if 'password' not in body:
        return jsonify({'msg': "El campo password es obligatorio"}), 400

    user_exist = User.query.filter_by(email=body["email"]).first()
    username_exist = User.query.filter_by(username=body["username"]).first()

    if user_exist is not None:
        return jsonify({"msg": "Este email ya esta registrado"}), 400
    if username_exist is not None:
        return jsonify({"msg": "Este nombre de usuario ya está registrado"}), 400

    new_user = User()
    new_user.email = body['email']
    new_user.username = body['username']
    pw_hash = bcrypt.generate_password_hash(body["password"]).decode("utf-8")
    new_user.password = pw_hash
    new_user.is_active = True
    db.session.add (new_user)
    db.session.commit()
    return jsonify({"msg": "El usuario ha sido creado con exito"}), 201


@app.route('/api/login', methods=['POST'])
def login():
    body = request.get_json(silent = True)
    if body is None:
        return jsonify({'msg': "Debes enviar información en el body"}), 400
    if 'email' not in body:
        return jsonify({'msg': "El campo email es obligatorio"}), 400
    if 'password' not in body:
        return jsonify({'msg': "El campo password es obligatorio"}), 400
    user = User.query.filter_by(email= body["email"]).first()
    if user is None:
        return jsonify({'msg': "El usuario no existe"}), 400
    password_correct = bcrypt.check_password_hash(user.password, body["password"])
    if not password_correct:
        return jsonify({'msg': "La contraseña es incorrecta"}), 400
    access_token = create_access_token(identity=user.email)
    return jsonify({'msg': "Login aceptado",
                    'token': access_token})


@app.route('/api/pronostico', methods=['POST'])
@jwt_required()
def add_pronostico():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({'msg': "Usuario no encontrado"}), 404

    body = request.get_json(silent=True)
    if not body:
        return jsonify({'msg': "Debes enviar información en el cuerpo de la solicitud"}), 400
    if 'event_date' not in body or 'event_name' not in body or 'prediction' not in body or 'odds' not in body or 'amount_bet' not in body or 'stake' not in body:
        return jsonify({'msg': "Faltan campos obligatorios en el pronóstico"}), 400

    pronostico = Apuestas(
        user_id=user.id,
        event_date=body['event_date'],
        event_name=body['event_name'],
        prediction=body['prediction'],
        odds=body['odds'],
        amount_bet=body['amount_bet'],
        stake=body['stake']
    )

    if 'resultado' not in body:
        db.session.add(pronostico)
        db.session.commit()
        return jsonify({'msg': "Pronóstico añadido exitosamente"}), 201

    if body['resultado'] == 'ganada':
        pronostico.result_amount = body['amount_bet'] * body['odds']
        pronostico.result_units = body['odds'] * body['stake'] - body['stake']
    elif body['resultado'] == 'perdida':
        pronostico.result_amount = -1 * body['amount_bet']  
        pronostico.result_units = -1 * body['stake']  
    else:
        pronostico.result_amount = 0
        pronostico.result_units = 0

    db.session.add(pronostico)
    db.session.commit()

    return jsonify({'msg': "Pronóstico añadido exitosamente"}), 201


@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


@app.route('/api/current-user', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    print(user.id)
    if user:
        return jsonify(user.serialize()), 200
    else:
        return jsonify({"msg": "Usuario no encontrado"}), 404


@app.route('/api/bets/user', methods=['GET'])
@jwt_required()
def get_user_bets():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({'msg': "Usuario no encontrado"}), 404

    bets = Apuestas.query.filter_by(user_id=user.id).all()

    bets_serialized = [bet.serialize() for bet in bets]

    return jsonify(bets_serialized), 200


@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({'msg': "Usuario no encontrado"}), 404

    user_data = user.serialize()

    return jsonify({'user': user_data}), 200


@app.route('/api/stats/user', methods=['GET'])
@jwt_required()
def get_user_stats():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({'msg': "Usuario no encontrado"}), 404

    bets = Apuestas.query.filter_by(user_id=user.id).all()

    stats = calcular_estadisticas(bets)

    user_stats = EstadisticasUsuario(
        user_id=user.id,
        money_bet=stats["money_bet"],
        money_won=stats["money_won"],
        profit=stats["profit"],
        played_units=stats["played_units"],
        profit_units=stats["profit_units"],
        yield_percentage=stats["yield_percentage"],
        total_bets=stats["total_bets"],
        wins=stats["wins"],
        losses=stats["losses"],
        draws=stats["draws"],
        success_rate=stats["success_rate"],
        average_odds=stats["average_odds"],
        average_stake=stats["average_stake"]
    )
    db.session.add(user_stats)
    db.session.commit()

    return jsonify({'bets': [bet.serialize() for bet in bets], 'stats': stats}), 200


@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'msg': "Usuario no encontrado"}), 404

    user_data = user.serialize()

    return jsonify({'user': user_data}), 200


@app.route('/api/stats/user/<int:user_id>', methods=['GET'])
def get_user_stats_by_id(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'msg': "Usuario no encontrado"}), 404

    bets = Apuestas.query.filter_by(user_id=user_id).all()

    stats = calcular_estadisticas(bets)

    user_stats = EstadisticasUsuario.query.filter_by(user_id=user_id).first()

    if not user_stats:
        user_stats = EstadisticasUsuario(
            user_id=user.id,
            money_bet=stats["money_bet"],
            money_won=stats["money_won"],
            profit=stats["profit"],
            played_units=stats["played_units"],
            profit_units=stats["profit_units"],
            yield_percentage=stats["yield_percentage"],
            total_bets=stats["total_bets"],
            wins=stats["wins"],
            losses=stats["losses"],
            draws=stats["draws"],
            success_rate=stats["success_rate"],
            average_odds=stats["average_odds"],
            average_stake=stats["average_stake"]
        )
    
    return jsonify({'bets': [bet.serialize() for bet in bets], 'stats': stats, 'user_stats': user_stats.serialize()}), 200


@app.route('/api/rankings', methods=['GET'])
def get_rankings():
    users = User.query.all()

    rankings = []
    for user in users:
        bets = Apuestas.query.filter_by(user_id=user.id).all()
        stats = calcular_estadisticas(bets)
        if stats:
            rankings.append({
                "user_id": user.id,
                "username": user.username,
                "yield_percentage": stats["yield_percentage"], 
                "profit_units": stats["profit_units"]
            })

    rankings = sorted(rankings, key=lambda x: x["profit_units"], reverse=True)

    return jsonify(rankings), 200


'''-------------------------------------Finish Endpoints---------------------------------'''


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
