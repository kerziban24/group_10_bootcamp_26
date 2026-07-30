import React from 'react';
import { Coffee, Mail, Calendar, Sparkles, Sliders, Activity, MessageSquare, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar({
  activeTab,
  setActiveTab,
  tonePreference,
  handleToneChange,
  triggerEmailSimulation,
  emailLoading,
  emailSent,
  onLogout
}) {
  return (
    <header className="header">
      <div className="logo-section">
        <Coffee size={28} className="logo-icon" />
        <div className="brand-meta">
          <h1 className="logo-text">Sabah Turu</h1>
          <span className="pitch-text">"Portföyünüze özel, kısa ve net bir piyasa özetiyle güncel gelişmeleri hızlıca takip edin."</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'briefing' ? 'active' : ''}`}
          onClick={() => setActiveTab('briefing')}
        >
          <Calendar size={15} />
          Günün Turu
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          <Sliders size={15} />
          Takip Listem
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTab('news')}
        >
          <Activity size={15} />
          Haber Analizi
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare size={15} />
          AI Asistan
        </button>
      </nav>

      <div className="header-controls">
        <button
          onClick={triggerEmailSimulation}
          disabled={emailLoading}
          className="btn-email"
        >
          <Mail size={15} />
          {emailLoading ? "Gönderiliyor..." : emailSent ? "Gönderildi!" : "Günlüğü E-Postala"}
        </button>

        <button
          onClick={onLogout}
          className="btn-logout"
          title="Oturumu Kapat"
        >
          <LogOut size={15} />
          Çıkış
        </button>
      </div>
    </header>
  );
}
