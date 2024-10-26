from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    photo = db.Column(db.String, unique=False, nullable=True)

    def __repr__(self):
        return "Usuario {}, con email {}".format(self.username, self.email)
    
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "username": self.username,
            "photo": self.photo
        }

class Apuestas(db.Model):
    __tablename__ = "apuestas"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_relationship = db.relationship(User)
    event_date = db.Column(db.Date, nullable=False)
    event_name = db.Column(db.String(100), nullable=False)
    prediction = db.Column(db.String(100), nullable=False)
    odds = db.Column(db.Numeric)
    amount_bet = db.Column(db.Numeric)
    stake = db.Column(db.Numeric)
    resultado = db.Column(db.String(20)) 
    result_amount = db.Column(db.Numeric)
    result_units = db.Column(db.Numeric)

    def __repr__(self):
        return "Apuesta añadida: {}".format(self.prediction)

    def serialize(self):
        return {
            "id": self.id,
            "event_date": self.event_date,
            "event_name": self.event_name,
            "prediction": self.prediction,
            "odds": self.odds,
            "amount_bet": self.amount_bet,
            "stake": self.stake,
            "resultado": self.resultado,
            "result_amount": self.result_amount,
            "result_units": self.result_units
        }

class EstadisticasUsuario(db.Model):
    __tablename__ = "estadisticas"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_relationship = db.relationship(User)
    unit_value = db.Column(db.Numeric)
    money_bet = db.Column(db.Numeric)
    money_won = db.Column(db.Numeric)
    profit = db.Column(db.Numeric)
    played_units = db.Column(db.Numeric)
    profit_units = db.Column(db.Numeric)
    yield_percentage = db.Column(db.Numeric)
    total_bets = db.Column(db.Integer)
    wins = db.Column(db.Integer)
    losses = db.Column(db.Integer)
    draws = db.Column(db.Integer)
    success_rate = db.Column(db.Numeric)
    average_odds = db.Column(db.Numeric)
    average_stake = db.Column(db.Numeric)

    def __repr__(self):
        return f'<EstadisticasUsuario {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "unit_value": self.unit_value,
            "money_bet": self.money_bet,
            "money_won": self.money_won,
            "profit": self.profit,
            "played_units": self.played_units,
            "profit_units": self.profit_units,
            "yield_percentage": self.yield_percentage,
            "total_bets": self.total_bets,
            "wins": self.wins,
            "losses": self.losses,
            "draws": self.draws,
            "success_rate": self.success_rate,
            "average_odds": self.average_odds,
            "average_stake": self.average_stake
        }
