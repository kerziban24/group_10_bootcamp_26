import React from 'react';
import { Cpu, Database } from 'lucide-react';
import './DevPanel.css';

export default function DevPanel({ isMockMode, setIsMockMode, dbConnected }) {
  return (
    <div className="dev-banner">
      <div className="dev-indicator">
        <span>Sistem Durumu: </span>
        <strong>{isMockMode ? "Örnek Görünüm" : "Canlı Veri"}</strong>
      </div>
      <div className="dev-controls">
        {!isMockMode && (
          <span className={`db-status-badge ${dbConnected ? "connected" : "disconnected"}`}>
            {dbConnected ? "MySQL Bağlı" : "MySQL Bağlantı Hatası"}
          </span>
        )}
        <button
          className={`badge-toggle ${isMockMode ? 'active' : ''}`}
          onClick={() => setIsMockMode(true)}
        >
          <Cpu size={12} />
          Örnek
        </button>
        <button
          className={`badge-toggle ${!isMockMode ? 'active' : ''}`}
          onClick={() => setIsMockMode(false)}
        >
          <Database size={12} />
          Canlı Veri
        </button>
      </div>
    </div>
  );
}
