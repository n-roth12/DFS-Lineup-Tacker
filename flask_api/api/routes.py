from api import app, db, ma
from flask import Flask, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
import json
import requests
import redis
from flask_cors import cross_origin
from api.models.player import Player, PlayerSchema
from api.models.lineup import Lineup, LineupSchema, FullLineupSchema
from api.models.user import User

# to start flask_api server, run npm run start-flask-api in react_project
# to start react server, run npm start in react_project
# to start redis, run redis-server in the terminal in any directory

redis_client = redis.Redis(host='localhost', port=6379, db=0)

@app.route('/test', methods=['GET'])

def get_test():
	return jsonify({ 'Message': 'Test GET succeeded!' })


@app.route('/players', methods=['GET'])
def get_players():

	year = request.args.get('year')
	week = request.args.get('week')

	key = f'players_{year}_{week}'
	players_from_cache = redis_client.get(key)

	if players_from_cache is None:
		res = requests.get(f'https://ffbapi.herokuapp.com/api/top?year={year}&week={week}',
			headers={ 'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwdWJsaWNfaWQiOiJlZDg3MTJlYi03NmI5LTRlMDctODJjNS1lMTQ0Y2FjNjhlYjAifQ.P4W9vpQpXOVIRhvqBDtK42h4gx_4i5bq07geyAtWs7E' }
		)
		players_from_api = res.json()
		redis_client.set(key, json.dumps(players_from_api))
		players_from_cache = redis_client.get(key)

	players = json.loads(players_from_cache)

	return jsonify({ 'players': players }), 200
	

@app.route('/players', methods=['POST'])
def add_player():
	data = json.loads(request.data)
	if not data:
		return jsonify({ 'Error': 'Request body does not contain necessary data.' })

	new_player = Player(name=data['name'], position=data['position'], team=data['team'])
	db.session.add(new_player)
	db.session.commit()

	return jsonify({ 'Message': 'New player successfully addded!' })


@app.route('/players/<id>', methods=['DELETE'])
def delete_player(id: int):
	player = db.session.query(Player).filter(Player.id == id).first()
	if not player:
		return jsonify({ 'Error': 'No player found with specified id.' })
	
	db.session.delete(player)
	db.session.commit()

	return jsonify({ 'Message': 'Player successfully deleted!' })


@app.route('/players/<id>', methods=['PUT'])
def edit_player(id: int):
	player = db.session.query(Player).filter(Player.id == id).first()
	if not player:
		return jsonify({ 'Error': 'No player with specified id.' })
	
	data = request.get_json()
	if data["name"]:
		player.name = data["name"]
	if data["position"]:
		player.position = data["position"]
	if data["team"]:
		player.team = data["team"]
	db.session.commit()

	return jsonify({ 'Message': 'Player information successfully updated!' })


@app.route('/lineups', defaults={'id': None}, methods=['GET'])
@app.route('/lineups/<id>', methods=['GET'])
def get_lineup(id: int):
	if not id:
		lineups = db.session.query(Lineup).all()
		if not len(lineups):
			return jsonify({ 'Error': 'No lineups in database!' })

		schema = LineupSchema(many=True)
		return jsonify({ 'lineups': schema.dump(lineups) })

	lineup = db.session.query(Lineup).filter(Lineup.id == id).first()
	if not lineup:
		return jsonify({ 'Error': 'No lineup with specified id.' })

	l = LineupSchema().dump(lineup)
	response = {}
	for key, value in l.items():
		if value != None:
			data = requests.get(f'https://ffbapi.herokuapp.com/api/v1/stats/{value}')
			response[key] = data

	# response = {}
	# response["id"] = l["id"]
	# response["week"] = l["week"]
	# response["year"] = l["year"]
	# for key, value in l.items():
	# 	if key != "id" and key != "week" and key != "year":
	# 		if value is None:
	# 			response[key] = None
	# 		else:
	# 			p = db.session.query(Player).filter(Player.id == value).first()
	# 			response[key] = PlayerSchema().dump(p)

	return jsonify(LineupSchema().dump(lineup))


@app.route('/best_week/<user_id>', methods=['GET'])
def get_best_week(user_id):
	lineups = get_user(user_id)
	data = json.loads(lineups.data)

	print(data)

	return jsonify({ 'Message': 'Success' })


@app.route('/player_counts', methods=['GET'])
def get_player_counts():
	lineups = db.session.query(Lineup).all()

	player_counts_dict = {}

	for lineup in lineups:
		data = json.loads(get_lineup_data(lineup.id)[0].data)
		print(data)
		
		# for lineup_data in data:
		# 	if lineup_data[]

	return jsonify({ 'Message': 'Success' })


@app.route('/lineups', methods=['POST'])
def create_lineup():
	data = json.loads(request.data)
	new_lineup = Lineup(user_id=data["user_id"], 
						week=data["week"], 
						year=data["year"], 
						bet=data["bet"], 
						winnings=data["winnings"])
	db.session.add(new_lineup)
	db.session.commit()

	return jsonify(LineupSchema().dump(new_lineup))

#### TODO make the put request return the lineup so i dont have to do an additional get request


@app.route('/lineups/<id>', methods=['PUT'])
def edit_lineup(id: int):
	key = f'lineup_data_{id}'

	redis_client.delete(key)

	lineup = db.session.query(Lineup).filter(Lineup.id == id).first()
	if not lineup:
		return jsonify({ 'Error': 'No lineup with specified id.' })
	
	data = json.loads(request.data)
	lineup.update(data)
	db.session.commit()

	return jsonify({ 'updated_lineup': LineupSchema().dump(lineup) })


@app.route('/lineups/<id>', methods=['DELETE'])
def delete_lineup(id: int):
	lineup = db.session.query(Lineup).filter(Lineup.id == id).first()
	if not lineup:
		return jsonify({ 'Error': 'No lineup found with specified id.' })
	
	db.session.delete(lineup)
	db.session.commit()
	return jsonify({ 'Message': 'Lineup successfully deleted!' })


@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id: int):

	user_lineups = db.session.query(Lineup) \
		.filter(Lineup.user_id == user_id) \
		.order_by(Lineup.year.desc(), Lineup.week.desc()).all()

	if not len(user_lineups):
		return jsonify({ 'Error': 'No lineups for specified user.' })

	whole_response = []
	for user_lineup in user_lineups:
		response = {}
		response["id"] = user_lineup.id
		response["week"] = user_lineup.week
		response["year"] = user_lineup.year
		response["points"] =user_lineup.points
		response["bet"] = user_lineup.bet
		response["winnings"] = user_lineup.winnings

		whole_response.append(response)
	return jsonify(whole_response)


@app.route('/lineup_data/<lineup_id>', methods=['GET'])
def get_lineup_data(lineup_id: int):
	key = f'lineup_data_{lineup_id}'
	lineup_data_from_cache = redis_client.get(key)
	if lineup_data_from_cache is None:

		body_data = requests.get(f'http://127.0.0.1:5000/lineups/{lineup_id}').json()
		res = requests.post(f'https://ffbapi.herokuapp.com/api/playergamestats', 
							headers={ 'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwdWJsaWNfaWQiOiJlZDg3MTJlYi03NmI5LTRlMDctODJjNS1lMTQ0Y2FjNjhlYjAifQ.P4W9vpQpXOVIRhvqBDtK42h4gx_4i5bq07geyAtWs7E' },
							json=body_data)
		lineup_data_from_api = res.json()

		redis_client.set(key, json.dumps(lineup_data_from_api))
		lineup_data_from_cache = redis_client.get(key)

	result = json.loads(lineup_data_from_cache)

	return jsonify({ 'lineup_data': result }), 200


@app.route('/users/register', methods=['POST'])
def register_user():
	data = json.loads(request.data)

	user_exists = db.session.query(User.id).filter(User.username == data['username']).first()
	if user_exists:
		return jsonify({ 'Error': 'Username is already in use.' }), 409

	user_to_create = User(username=data['username'], password=data['password'])
	db.session.add(user_to_create)
	db.session.commit()

	login_user(user_to_create)
	return jsonify({ 'message': 'new user successfully registered', 'id': str(user_to_create.id) }), 200

@app.route('/users/login', methods=['POST'])
def login_user():
	data = json.loads(request.data)

	attempted_user = db.session.query(User).filter(User.username == data['username']).first()
	if attempted_user and attempted_user.check_password_correction(attempted_password=data['password']):
		return jsonify({ 'token': 'token12345', 'user_id': attempted_user.id })
	else:
		return jsonify({ 'Error': 'Unable to login.' }), 403


@app.route('/users', methods=['GET'])
def get_users():
	users = db.session.query(User).all()
	return jsonify({'Message': str(len(users))}), 200


# @app.route('/favorite_players/<user_id>', methods=['GET'])
# def get_favorite_players(user_id: int):
# 	lineups = get_user(user_id)
# 	for lineup in lineups.get_json():
# 		res = get_lineup_data(lineup['id']).json()
# 		print(res)











