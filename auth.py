import bcrypt
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from src.models.base import db, Professor, Admin, UserRole, Auditoria

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_id: int, role: UserRole, username: str = None) -> str:
    """Create a JWT token for a user"""
    additional_claims = {
        "role": role.value,
        "username": username
    }
    return create_access_token(
        identity=user_id,
        additional_claims=additional_claims,
        expires_delta=timedelta(hours=24)
    )

def role_required(*allowed_roles):
    """Decorator to require specific roles for access"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get('role')
            
            if user_role not in [role.value for role in allowed_roles]:
                return jsonify({'erro': 'Acesso negado'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def get_current_user():
    """Get current user information from JWT token"""
    try:
        claims = get_jwt()
        user_id = get_jwt_identity()
        role = claims.get('role')
        username = claims.get('username')
        
        return {
            'id': user_id,
            'role': role,
            'username': username
        }
    except:
        return None

def log_audit(acao: str, entidade: str, entidade_id: int = None, payload: dict = None):
    """Log an audit entry"""
    try:
        current_user = get_current_user()
        
        audit_entry = Auditoria(
            user_id=current_user['id'] if current_user else None,
            role=UserRole(current_user['role']) if current_user else UserRole.VISITANTE,
            acao=acao,
            entidade=entidade,
            entidade_id=entidade_id,
            payload_json=payload
        )
        
        db.session.add(audit_entry)
        db.session.commit()
    except Exception as e:
        print(f"Erro ao registrar auditoria: {e}")

def authenticate_professor(username: str, password: str):
    """Authenticate a professor"""
    professor = Professor.query.filter_by(username=username, ativo=True).first()
    if professor and verify_password(password, professor.password_hash):
        return professor
    return None

def authenticate_admin(username: str, password: str):
    """Authenticate an admin"""
    admin = Admin.query.filter_by(username=username).first()
    if admin and verify_password(password, admin.password_hash):
        return admin
    return None

def professor_owns_team(professor_id: int, time_id: int) -> bool:
    """Check if a professor owns a specific team"""
    from src.models.base import Time
    time = Time.query.filter_by(id=time_id, professor_id=professor_id).first()
    return time is not None

def professor_can_access_game(professor_id: int, jogo_id: int) -> bool:
    """Check if a professor can access a specific game (their team is playing)"""
    from src.models.base import Jogo, Time
    jogo = Jogo.query.get(jogo_id)
    if not jogo:
        return False
    
    # Check if professor owns either team in the game
    time_casa = Time.query.filter_by(id=jogo.time_casa_id, professor_id=professor_id).first()
    time_fora = Time.query.filter_by(id=jogo.time_fora_id, professor_id=professor_id).first()
    
    return time_casa is not None or time_fora is not None

