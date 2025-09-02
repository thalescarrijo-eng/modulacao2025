#!/usr/bin/env python3
"""
Database seeding script for Copa Escolar Municipal
Seeds the database with exact competitions, schools, and teachers as specified
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.base import (
    db, Escola, Professor, Competicao, Admin, 
    Modalidade, Genero, SubCategoria, CompetitionStatus
)
from src.auth import hash_password

def seed_competitions():
    """Seed competitions with exact data provided"""
    competitions_data = [
        {
            'titulo': 'FUTSAL MASCULINO SUB-11',
            'modalidade': Modalidade.FUTSAL,
            'genero': Genero.MASCULINO,
            'sub_categoria': SubCategoria.SUB_11
        },
        {
            'titulo': 'FUTSAL MASCULINO SUB-09',
            'modalidade': Modalidade.FUTSAL,
            'genero': Genero.MASCULINO,
            'sub_categoria': SubCategoria.SUB_09
        },
        {
            'titulo': 'FUTSAL FEMININO SUB-11',
            'modalidade': Modalidade.FUTSAL,
            'genero': Genero.FEMININO,
            'sub_categoria': SubCategoria.SUB_11
        },
        {
            'titulo': 'QUEIMADA MASCULINO SUB-11',
            'modalidade': Modalidade.QUEIMADA,
            'genero': Genero.MASCULINO,
            'sub_categoria': SubCategoria.SUB_11
        },
        {
            'titulo': 'QUEIMADA FEMININO SUB-09',
            'modalidade': Modalidade.QUEIMADA,
            'genero': Genero.FEMININO,
            'sub_categoria': SubCategoria.SUB_09
        },
        {
            'titulo': 'QUEIMADA FEMININO SUB-11',
            'modalidade': Modalidade.QUEIMADA,
            'genero': Genero.FEMININO,
            'sub_categoria': SubCategoria.SUB_11
        }
    ]
    
    for comp_data in competitions_data:
        # Check if competition already exists
        existing = Competicao.query.filter_by(titulo=comp_data['titulo']).first()
        if not existing:
            competition = Competicao(**comp_data)
            db.session.add(competition)
            print(f"Adicionada competição: {comp_data['titulo']}")
        else:
            print(f"Competição já existe: {comp_data['titulo']}")

def seed_schools():
    """Seed schools with exact data provided"""
    schools_data = [
        'Escola Municipal Professor Juarez Távora de Carvalho',
        'Escola Municipal Maria Aparecida de Almeida Paniago',
        'Escola Municipal Padre Maximino Alvarez Gutierrez',
        'Escola Municipal Dom Bosco',
        'Escola Municipal Tonico Corredeira',
        'Escola Municipal Santo Antônio',
        'Escola Municipal Professor Salviano Neves Amorim',
        'Escola Municipal Otalecio Alves Irineu',
        'Escola Municipal Maria Eduarda Condinho Filgueiras',
        'Escola Municipal Elias Carrijo de Sousa'
    ]
    
    for school_name in schools_data:
        # Check if school already exists
        existing = Escola.query.filter_by(nome=school_name).first()
        if not existing:
            school = Escola(nome=school_name)
            db.session.add(school)
            print(f"Adicionada escola: {school_name}")
        else:
            print(f"Escola já existe: {school_name}")

def seed_teachers():
    """Seed teachers with exact data provided"""
    teachers_data = [
        'Cristiane Alves',
        'Lindonei Junior',
        'Alberto',
        'Ana Mireile',
        'Daiana',
        'Domingos',
        'Hugo',
        'Lorena',
        'Poliane Vilela',
        'Ana Paula',
        'Fernando Shoenberger Machado',
        'MArianny'
    ]
    
    def create_username(name):
        """Create username from name without accents"""
        # Simple accent removal and username creation
        name_clean = name.lower()
        name_clean = name_clean.replace('ã', 'a').replace('á', 'a').replace('â', 'a')
        name_clean = name_clean.replace('é', 'e').replace('ê', 'e')
        name_clean = name_clean.replace('í', 'i').replace('î', 'i')
        name_clean = name_clean.replace('ó', 'o').replace('ô', 'o').replace('õ', 'o')
        name_clean = name_clean.replace('ú', 'u').replace('û', 'u')
        name_clean = name_clean.replace('ç', 'c')
        
        # Create username from first name and last name
        parts = name_clean.split()
        if len(parts) > 1:
            username = f"{parts[0]}.{parts[-1]}"
        else:
            username = parts[0]
        
        # Remove spaces and special characters
        username = username.replace(' ', '').replace('-', '')
        return username
    
    default_password = "Trocar123!"
    hashed_password = hash_password(default_password)
    
    for teacher_name in teachers_data:
        username = create_username(teacher_name)
        
        # Check if teacher already exists
        existing = Professor.query.filter_by(username=username).first()
        if not existing:
            teacher = Professor(
                nome=teacher_name,
                username=username,
                password_hash=hashed_password,
                ativo=True
            )
            db.session.add(teacher)
            print(f"Adicionado professor: {teacher_name} (usuário: {username})")
        else:
            print(f"Professor já existe: {teacher_name} (usuário: {username})")

def seed_admin():
    """Create default admin user"""
    admin_username = "admin"
    admin_password = "TrocarAdmin123!"
    
    # Check if admin already exists
    existing = Admin.query.filter_by(username=admin_username).first()
    if not existing:
        admin = Admin(
            username=admin_username,
            password_hash=hash_password(admin_password)
        )
        db.session.add(admin)
        print(f"Adicionado administrador: {admin_username}")
    else:
        print(f"Administrador já existe: {admin_username}")

def run_seed():
    """Run all seeding functions"""
    print("Iniciando seeding do banco de dados...")
    
    try:
        # Create all tables
        db.create_all()
        print("Tabelas criadas/verificadas")
        
        # Seed data
        seed_competitions()
        seed_schools()
        seed_teachers()
        seed_admin()
        
        # Commit all changes
        db.session.commit()
        print("Seeding concluído com sucesso!")
        
        # Print summary
        print("\n=== RESUMO ===")
        print(f"Competições: {Competicao.query.count()}")
        print(f"Escolas: {Escola.query.count()}")
        print(f"Professores: {Professor.query.count()}")
        print(f"Administradores: {Admin.query.count()}")
        
        print("\n=== CREDENCIAIS PADRÃO ===")
        print("Administrador:")
        print("  Usuário: admin")
        print("  Senha: TrocarAdmin123!")
        print("\nProfessores:")
        print("  Senha padrão para todos: Trocar123!")
        print("  Usuários criados:")
        for prof in Professor.query.all():
            print(f"    {prof.nome}: {prof.username}")
        
    except Exception as e:
        db.session.rollback()
        print(f"Erro durante o seeding: {e}")
        raise

if __name__ == '__main__':
    from flask import Flask
    from src.models.base import db
    
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    with app.app_context():
        run_seed()

