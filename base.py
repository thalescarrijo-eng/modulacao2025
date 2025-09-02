from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum

db = SQLAlchemy()

class UserRole(Enum):
    VISITANTE = "VISITANTE"
    PROFESSOR = "PROFESSOR"
    ADM = "ADM"

class CompetitionStatus(Enum):
    PLANEJADA = "Planejada"
    EM_ANDAMENTO = "Em andamento"
    ENCERRADA = "Encerrada"

class GameStatus(Enum):
    AGENDADO = "Agendado"
    EM_ANDAMENTO = "Em andamento"
    ENCERRADO = "Encerrado"

class ResourceStatus(Enum):
    ABERTO = "Aberto"
    EM_ANALISE = "Em análise (ADM)"
    DEFERIDO = "Deferido"
    INDEFERIDO = "Indeferido"

class Modalidade(Enum):
    FUTSAL = "Futsal"
    QUEIMADA = "Queimada"

class Genero(Enum):
    MASCULINO = "Masculino"
    FEMININO = "Feminino"

class SubCategoria(Enum):
    SUB_09 = "SUB-09"
    SUB_11 = "SUB-11"

# Association table for many-to-many relationship between Professor and Escola
professor_escola = db.Table('professor_escola',
    db.Column('professor_id', db.Integer, db.ForeignKey('professor.id'), primary_key=True),
    db.Column('escola_id', db.Integer, db.ForeignKey('escola.id'), primary_key=True)
)

class Escola(db.Model):
    __tablename__ = 'escola'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    times = db.relationship('Time', backref='escola', lazy=True)
    professores = db.relationship('Professor', secondary=professor_escola, back_populates='escolas')

class Professor(db.Model):
    __tablename__ = 'professor'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=True)
    ativo = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    escolas = db.relationship('Escola', secondary=professor_escola, back_populates='professores')
    times = db.relationship('Time', backref='professor', lazy=True)
    recursos = db.relationship('Recurso', backref='professor', lazy=True)

class Competicao(db.Model):
    __tablename__ = 'competicao'
    
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(255), nullable=False)
    modalidade = db.Column(db.Enum(Modalidade), nullable=False)
    genero = db.Column(db.Enum(Genero), nullable=False)
    sub_categoria = db.Column(db.Enum(SubCategoria), nullable=False)
    status = db.Column(db.Enum(CompetitionStatus), default=CompetitionStatus.PLANEJADA)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    times = db.relationship('Time', backref='competicao', lazy=True)
    jogos = db.relationship('Jogo', backref='competicao', lazy=True)

class Time(db.Model):
    __tablename__ = 'time'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    escola_id = db.Column(db.Integer, db.ForeignKey('escola.id'), nullable=False)
    competicao_id = db.Column(db.Integer, db.ForeignKey('competicao.id'), nullable=False)
    professor_id = db.Column(db.Integer, db.ForeignKey('professor.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    atletas = db.relationship('Atleta', backref='time', lazy=True, cascade='all, delete-orphan')
    jogos_casa = db.relationship('Jogo', foreign_keys='Jogo.time_casa_id', backref='time_casa', lazy=True)
    jogos_fora = db.relationship('Jogo', foreign_keys='Jogo.time_fora_id', backref='time_fora', lazy=True)
    participacoes = db.relationship('ParticipacaoEmJogo', backref='time', lazy=True)
    recursos = db.relationship('Recurso', backref='time', lazy=True)

class Atleta(db.Model):
    __tablename__ = 'atleta'
    
    id = db.Column(db.Integer, primary_key=True)
    time_id = db.Column(db.Integer, db.ForeignKey('time.id'), nullable=False)
    numero_camisa = db.Column(db.Integer, nullable=False)
    nome_opcional = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('time_id', 'numero_camisa', name='unique_numero_por_time'),)

class Jogo(db.Model):
    __tablename__ = 'jogo'
    
    id = db.Column(db.Integer, primary_key=True)
    competicao_id = db.Column(db.Integer, db.ForeignKey('competicao.id'), nullable=False)
    rodada = db.Column(db.Integer, nullable=False)
    data_hora = db.Column(db.DateTime, nullable=False)
    local = db.Column(db.String(255), nullable=False)
    time_casa_id = db.Column(db.Integer, db.ForeignKey('time.id'), nullable=False)
    time_fora_id = db.Column(db.Integer, db.ForeignKey('time.id'), nullable=False)
    placar_casa = db.Column(db.Integer, nullable=True)
    placar_fora = db.Column(db.Integer, nullable=True)
    status = db.Column(db.Enum(GameStatus), default=GameStatus.AGENDADO)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    participacoes = db.relationship('ParticipacaoEmJogo', backref='jogo', lazy=True)
    recursos = db.relationship('Recurso', backref='jogo', lazy=True)

class ParticipacaoEmJogo(db.Model):
    __tablename__ = 'participacao_em_jogo'
    
    id = db.Column(db.Integer, primary_key=True)
    jogo_id = db.Column(db.Integer, db.ForeignKey('jogo.id'), nullable=False)
    time_id = db.Column(db.Integer, db.ForeignKey('time.id'), nullable=False)
    numeros_atletas = db.Column(db.JSON, nullable=False)  # Array of integers
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Recurso(db.Model):
    __tablename__ = 'recurso'
    
    id = db.Column(db.Integer, primary_key=True)
    jogo_id = db.Column(db.Integer, db.ForeignKey('jogo.id'), nullable=False)
    time_id = db.Column(db.Integer, db.ForeignKey('time.id'), nullable=False)
    professor_id = db.Column(db.Integer, db.ForeignKey('professor.id'), nullable=False)
    status = db.Column(db.Enum(ResourceStatus), default=ResourceStatus.ABERTO)
    motivo = db.Column(db.Text, nullable=False)
    resposta_adm = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Auditoria(db.Model):
    __tablename__ = 'auditoria'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)  # Can be null for visitor actions
    role = db.Column(db.Enum(UserRole), nullable=False)
    acao = db.Column(db.String(255), nullable=False)
    entidade = db.Column(db.String(100), nullable=False)
    entidade_id = db.Column(db.Integer, nullable=True)
    payload_json = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Admin(db.Model):
    __tablename__ = 'admin'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

