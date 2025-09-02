from flask import Blueprint, request, jsonify
from sqlalchemy import and_, or_
from src.models.base import (
    db, Competicao, Escola, Time, Jogo, Atleta,
    GameStatus, CompetitionStatus
)
from src.auth import log_audit

public_bp = Blueprint('public', __name__)

@public_bp.route('/competicoes', methods=['GET'])
def get_competitions():
    """Get all competitions - public access"""
    try:
        competitions = Competicao.query.all()
        result = []
        
        for comp in competitions:
            result.append({
                'id': comp.id,
                'titulo': comp.titulo,
                'modalidade': comp.modalidade.value,
                'genero': comp.genero.value,
                'subCategoria': comp.sub_categoria.value,
                'status': comp.status.value,
                'createdAt': comp.created_at.isoformat(),
                'updatedAt': comp.updated_at.isoformat()
            })
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'erro': 'Erro interno do servidor'}), 500

@public_bp.route('/competicoes/<int:competition_id>', methods=['GET'])
def get_competition(competition_id):
    """Get specific competition details - public access"""
    try:
        competition = Competicao.query.get_or_404(competition_id)
        
        # Get teams in this competition
        teams = Time.query.filter_by(competicao_id=competition_id).all()
        teams_data = []
        
        for team in teams:
            teams_data.append({
                'id': team.id,
                'nome': team.nome,
                'escola': {
                    'id': team.escola.id,
                    'nome': team.escola.nome
                }
            })
        
        result = {
            'id': competition.id,
            'titulo': competition.titulo,
            'modalidade': competition.modalidade.value,
            'genero': competition.genero.value,
            'subCategoria': competition.sub_categoria.value,
            'status': competition.status.value,
            'times': teams_data,
            'createdAt': competition.created_at.isoformat(),
            'updatedAt': competition.updated_at.isoformat()
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'erro': 'Erro interno do servidor'}), 500

@public_bp.route('/jogos', methods=['GET'])
def get_games():
    """Get games with optional filters - public access"""
    try:
        # Get query parameters
        competicao_id = request.args.get('competicaoId', type=int)
        escola_id = request.args.get('escolaId', type=int)
        rodada = request.args.get('rodada', type=int)
        status = request.args.get('status')
        
        # Build query
        query = Jogo.query
        
        if competicao_id:
            query = query.filter(Jogo.competicao_id == competicao_id)
        
        if escola_id:
            # Filter games where the school has a team playing
            query = query.join(Time, or_(
                Jogo.time_casa_id == Time.id,
                Jogo.time_fora_id == Time.id
            )).filter(Time.escola_id == escola_id)
        
        if rodada:
            query = query.filter(Jogo.rodada == rodada)
        
        if status:
            try:
                status_enum = GameStatus(status)
                query = query.filter(Jogo.status == status_enum)
            except ValueError:
                pass
        
        games = query.order_by(Jogo.data_hora.desc()).all()
        result = []
        
        for game in games:
            result.append({
                'id': game.id,
                'competicao': {
                    'id': game.competicao.id,
                    'titulo': game.competicao.titulo
                },
                'rodada': game.rodada,
                'dataHora': game.data_hora.isoformat(),
                'local': game.local,
                'timeCasa': {
                    'id': game.time_casa.id,
                    'nome': game.time_casa.nome,
                    'escola': game.time_casa.escola.nome
                },
                'timeFora': {
                    'id': game.time_fora.id,
                    'nome': game.time_fora.nome,
                    'escola': game.time_fora.escola.nome
                },
                'placarCasa': game.placar_casa,
                'placarFora': game.placar_fora,
                'status': game.status.value
            })
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'erro': 'Erro interno do servidor'}), 500

@public_bp.route('/jogos/<int:game_id>', methods=['GET'])
def get_game(game_id):
    """Get specific game details - public access"""
    try:
        game = Jogo.query.get_or_404(game_id)
        
        result = {
            'id': game.id,
            'competicao': {
                'id': game.competicao.id,
                'titulo': game.competicao.titulo,
                'modalidade': game.competicao.modalidade.value,
                'genero': game.competicao.genero.value,
                'subCategoria': game.competicao.sub_categoria.value
            },
            'rodada': game.rodada,
            'dataHora': game.data_hora.isoformat(),
            'local': game.local,
            'timeCasa': {
                'id': game.time_casa.id,
                'nome': game.time_casa.nome,
                'escola': {
                    'id': game.time_casa.escola.id,
                    'nome': game.time_casa.escola.nome
                }
            },
            'timeFora': {
                'id': game.time_fora.id,
                'nome': game.time_fora.nome,
                'escola': {
                    'id': game.time_fora.escola.id,
                    'nome': game.time_fora.escola.nome
                }
            },
            'placarCasa': game.placar_casa,
            'placarFora': game.placar_fora,
            'status': game.status.value
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'erro': 'Erro interno do servidor'}), 500

@public_bp.route('/classificacao', methods=['GET'])
def get_classification():
    """Get classification/standings for a competition - public access"""
    try:
        competicao_id = request.args.get('competicaoId', type=int)
        if not competicao_id:
            return jsonify({'erro': 'ID da competição é obrigatório'}), 400
        
        # Get all teams in the competition
        teams = Time.query.filter_by(competicao_id=competicao_id).all()
        classification = []
        
        for team in teams:
            # Calculate team statistics
            jogos_casa = Jogo.query.filter_by(
                time_casa_id=team.id,
                status=GameStatus.ENCERRADO
            ).all()
            
            jogos_fora = Jogo.query.filter_by(
                time_fora_id=team.id,
                status=GameStatus.ENCERRADO
            ).all()
            
            jogos = len(jogos_casa) + len(jogos_fora)
            vitorias = 0
            empates = 0
            derrotas = 0
            gols_pro = 0
            gols_contra = 0
            pontos = 0
            
            # Calculate home games
            for jogo in jogos_casa:
                if jogo.placar_casa is not None and jogo.placar_fora is not None:
                    gols_pro += jogo.placar_casa
                    gols_contra += jogo.placar_fora
                    
                    if jogo.placar_casa > jogo.placar_fora:
                        vitorias += 1
                        pontos += 3
                    elif jogo.placar_casa == jogo.placar_fora:
                        empates += 1
                        pontos += 1
                    else:
                        derrotas += 1
            
            # Calculate away games
            for jogo in jogos_fora:
                if jogo.placar_casa is not None and jogo.placar_fora is not None:
                    gols_pro += jogo.placar_fora
                    gols_contra += jogo.placar_casa
                    
                    if jogo.placar_fora > jogo.placar_casa:
                        vitorias += 1
                        pontos += 3
                    elif jogo.placar_fora == jogo.placar_casa:
                        empates += 1
                        pontos += 1
                    else:
                        derrotas += 1
            
            saldo_gols = gols_pro - gols_contra
            
            classification.append({
                'time': {
                    'id': team.id,
                    'nome': team.nome,
                    'escola': team.escola.nome
                },
                'jogos': jogos,
                'vitorias': vitorias,
                'empates': empates,
                'derrotas': derrotas,
                'golsPro': gols_pro,
                'golsContra': gols_contra,
                'saldoGols': saldo_gols,
                'pontos': pontos
            })
        
        # Sort by points (desc), then by goal difference (desc), then by goals scored (desc)
        classification.sort(key=lambda x: (-x['pontos'], -x['saldoGols'], -x['golsPro']))
        
        # Add position
        for i, team_data in enumerate(classification):
            team_data['posicao'] = i + 1
        
        return jsonify(classification)
        
    except Exception as e:
        return jsonify({'erro': 'Erro interno do servidor'}), 500

@public_bp.route('/escolas', methods=['GET'])
def get_schools():
    """Get all schools - public access"""
    try:
        schools = Escola.query.all()
        result = []
        
        for school in schools:
            result.append({
                'id': school.id,
                'nome': school.nome,
                'createdAt': school.created_at.isoformat(),
                'updatedAt': school.updated_at.isoformat()
            })
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'erro': 'Erro interno do servidor'}), 500

