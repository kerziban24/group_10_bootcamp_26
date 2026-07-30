import React from 'react';
import { Activity, MessageSquare, Search, X } from 'lucide-react';
import './NewsFeed.css';

export default function NewsFeed({ 
  news, 
  handleSendMessage, 
  setActiveTab, 
  onNewsSelect, 
  newsFilter, 
  setNewsFilter 
}) {
  
  const handleAskAssistant = (e, ticker, headline) => {
    e.stopPropagation(); // Detay modalı açılmasını önle
    const prompt = `${ticker} hakkında çıkan "${headline.slice(0, 35)}..." haberi ne anlama geliyor?`;
    handleSendMessage(prompt);
    setActiveTab('chat');
  };

  // Filter news based on search filter
  const filteredNews = newsFilter
    ? news.filter(item => 
        item.ticker_sector.toLowerCase() === newsFilter.toLowerCase() ||
        item.headline.toLowerCase().includes(newsFilter.toLowerCase())
      )
    : news;

  return (
    <div className="news-tab-layout glass-card">
      <div className="news-header">
        <h2 className="tab-title">
          <Activity size={18} className="text-gold" />
          Gecelik Haber Akışı & Duygu Analizi
        </h2>

        {/* Dynamic Search/Filter Input */}
        <div className="news-search-container">
          <Search size={14} className="search-icon" />
          <input 
            type="text" 
            placeholder="Hisse kodu veya haber ara..." 
            value={newsFilter || ''}
            onChange={(e) => setNewsFilter(e.target.value)}
            className="news-search-input"
          />
          {newsFilter && (
            <button 
              onClick={() => setNewsFilter(null)} 
              className="clear-search-btn"
              title="Filtreyi Temizle"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>
      
      <p className="tab-subtitle">
        {newsFilter ? (
          <span><strong>"{newsFilter}"</strong> için filtrelenmiş haberler listeleniyor.</span>
        ) : (
          <span>AI ajanımız tarafından takip listenizdeki varlıklara göre etiketlenmiş son 24 saatlik piyasa haberleri.</span>
        )}
      </p>

      <div className="news-feed-grid">
        {filteredNews.length === 0 ? (
          <div className="news-empty-state">
            <p>Aradığınız kriterlere uygun haber bulunamadı.</p>
            {newsFilter && (
              <button onClick={() => setNewsFilter(null)} className="btn-reset-filter">
                Tüm Haberleri Göster
              </button>
            )}
          </div>
        ) : (
          filteredNews.map((item, idx) => {
            const isPositive = item.raw_sentiment_score > 0.3;
            const isNegative = item.raw_sentiment_score < -0.3;
            const sentimentText = isPositive ? "Olumlu / Boğa" : isNegative ? "Olumsuz / Ayı" : "Nötr";
            const sentimentClass = isPositive ? "badge-positive" : isNegative ? "badge-negative" : "badge-neutral";
            const importanceClass = item.importance === "High" ? "badge-high" : item.importance === "Medium" ? "badge-medium" : "badge-low";
            
            return (
              <div 
                key={idx} 
                className="news-card-box clickable-news-card"
                onClick={() => onNewsSelect(item)}
                title="Detaylı Oku"
              >
                <div className="news-card-top">
                  <span className="ticker-badge">
                    {item.ticker_sector}
                  </span>
                  <div className="badge-group">
                    <span className={`news-badge ${importanceClass}`}>Önem: {item.importance}</span>
                    <span className={`news-badge ${sentimentClass}`}>{sentimentText} ({item.raw_sentiment_score})</span>
                  </div>
                </div>
                
                <h3 className="news-card-title">{item.headline}</h3>
                
                <div className="news-card-bottom">
                  <span className="news-meta">Kaynak: {item.source} • Tarih: {item.date}</span>
                  <button 
                    onClick={(e) => handleAskAssistant(e, item.ticker_sector, item.headline)}
                    className="btn-ask-ai"
                  >
                    Asistana Sor
                    <MessageSquare size={12} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
