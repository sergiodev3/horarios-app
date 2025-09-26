import React, { useState } from 'react';
import { authService } from '../services/authService';
import TeacherManagement from './TeacherManagement';
import SubjectManagement from './SubjectManagement';
import GroupManagement from './GroupManagement';
import ScheduleManagement from './ScheduleManagement';
import './Dashboard.css';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const user = authService.getUser();
  const [currentView, setCurrentView] = useState<'dashboard' | 'teachers' | 'subjects' | 'groups' | 'schedules'>('dashboard');

  const handleLogout = async () => {
    await authService.logout();
    onLogout();
  };

  if (currentView === 'teachers') {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="nav-section">
              <button 
                className="back-button" 
                onClick={() => setCurrentView('dashboard')}
              >
                ← Volver al Dashboard
              </button>
              <h1>Sistema de Horarios</h1>
            </div>
            <div className="user-info">
              <span>Bienvenido, {user?.username}</span>
              <span className="user-role">({user?.role})</span>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>
        <TeacherManagement />
      </div>
    );
  }

  if (currentView === 'subjects') {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="nav-section">
              <button 
                className="back-button" 
                onClick={() => setCurrentView('dashboard')}
              >
                ← Volver al Dashboard
              </button>
              <h1>Sistema de Horarios</h1>
            </div>
            <div className="user-info">
              <span>Bienvenido, {user?.username}</span>
              <span className="user-role">({user?.role})</span>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>
        <SubjectManagement />
      </div>
    );
  }

  if (currentView === 'groups') {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="nav-section">
              <button 
                className="back-button" 
                onClick={() => setCurrentView('dashboard')}
              >
                ← Volver al Dashboard
              </button>
              <h1>Sistema de Horarios</h1>
            </div>
            <div className="user-info">
              <span>Bienvenido, {user?.username}</span>
              <span className="user-role">({user?.role})</span>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>
        <GroupManagement />
      </div>
    );
  }

  if (currentView === 'schedules') {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="nav-section">
              <button 
                className="back-button" 
                onClick={() => setCurrentView('dashboard')}
              >
                ← Volver al Dashboard
              </button>
              <h1>Sistema de Horarios</h1>
            </div>
            <div className="user-info">
              <span>Bienvenido, {user?.username}</span>
              <span className="user-role">({user?.role})</span>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>
        <ScheduleManagement />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Sistema de Horarios</h1>
          <div className="user-info">
            <span>Bienvenido, {user?.username}</span>
            <span className="user-role">({user?.role})</span>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          <h2>Panel de Control</h2>
          <p>¡Bienvenido al sistema de gestión de horarios!</p>
          
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Profesores</h3>
              <p>Gestiona la información de los profesores</p>
              <button 
                className="card-button" 
                onClick={() => setCurrentView('teachers')}
              >
                Ver Profesores
              </button>
            </div>
            
            <div className="dashboard-card">
              <h3>Materias</h3>
              <p>Administra las materias del sistema</p>
              <button 
                className="card-button" 
                onClick={() => setCurrentView('subjects')}
              >
                Ver Materias
              </button>
            </div>
            
            <div className="dashboard-card">
              <h3>Grupos</h3>
              <p>Gestiona los grupos de estudiantes</p>
              <button 
                className="card-button" 
                onClick={() => setCurrentView('groups')}
              >
                Ver Grupos
              </button>
            </div>
            
            <div className="dashboard-card">
              <h3>Horarios</h3>
              <p>Administra los horarios académicos</p>
              <button 
                className="card-button" 
                onClick={() => setCurrentView('schedules')}
              >
                Ver Horarios
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;