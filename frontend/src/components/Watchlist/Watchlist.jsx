import React from 'react';
import { Sliders, Plus, Trash2, TrendingUp, TrendingDown, RefreshCw, X, MessageSquare, Newspaper } from 'lucide-react';
import './Watchlist.css';

export default function Watchlist({
  watchlist,
  marketData,
  apiLoading,
  watchlistMsg,
  newTicker,
  setNewTicker,
  newSector,
  setNewSector,
  handleAddWatchlist,
  handleRemoveWatchlist,
  onAssetSelect,
  onQuickAdd,
  selectedAsset,
  setSelectedAsset,
  handleSendMessage,
  setActiveTab,
  setNewsFilter
}) {
  
  // Sparkline SVG Path generator
  const getSparklinePath = (history, width = 100, height = 30) => {
    if (!history || history.length === 0) return `M 0,${height/2} L ${width},${height/2}`;
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    const points = history.map((val, index) => {
      const x = (index / (history.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const sectorPresets = [
    { name: 'Teknoloji', icon: '💻' },
    { name: 'Otomotiv', icon: '🚗' },
    { name: 'Finans / Bankacılık', icon: '🏦' },
    { name: 'Enerji', icon: '⚡' },
    { name: 'Emtia', icon: '🪙' }
  ];

  // Suggestions for auto-filling inputs
  const suggestions = [
    { ticker: 'NVDA', sector: 'Teknoloji', label: 'Nvidia' },
    { ticker: 'AAPL', sector: 'Teknoloji', label: 'Apple' },
    { ticker: 'TSLA', sector: 'Otomotiv', label: 'Tesla' },
    { ticker: 'BIST100', sector: 'Finans / Bankacılık', label: 'Bist' },
    { ticker: 'GOLD', sector: 'Emtia', label: 'Altın' }
  ];

  // Dynamically yield mock metrics based on ticker for right drawer panel
  const getAssetDetails = (ticker) => {
    const defaultDetails = {
      name: 'Piyasa Varlığı',
      pe: '18.4',
      marketCap: '$24.5 B',
      high52: '$120.00',
      low52: '$85.00',
      yield: '%1.8',
      risk: 'Orta',
      comment: 'Varlık stabil görünümde hareket ediyor, kısa vadeli beklentiler nötr.',
      sentimentBullish: 60,
      sentimentBearish: 20
    };

    const data = {
      NVDA: {
        name: 'Nvidia Corporation',
        pe: '72.4',
        marketCap: '$3.15 T',
        high52: '$140.76',
        low52: '$39.23',
        yield: '%0.02',
        risk: 'Düşük',
        comment: 'Blackwell çip mimarisine küresel talep rekor seviyede. Büyüme beklentileri güçlü seyrediyor, kısa vadeli görünüm boğa.',
        sentimentBullish: 80,
        sentimentBearish: 10
      },
      AAPL: {
        name: 'Apple Inc.',
        pe: '31.2',
        marketCap: '$3.28 T',
        high52: '$237.49',
        low52: '$164.08',
        yield: '%0.48',
        risk: 'Düşük',
        comment: 'Asya tedarik zincirinde sipariş kesintisi haberleri dalgalanma yaratıyor. Konsolidasyon beklenebilir.',
        sentimentBullish: 55,
        sentimentBearish: 15
      },
      TSLA: {
        name: 'Tesla, Inc.',
        pe: '58.6',
        marketCap: '$562.4 B',
        high52: '$271.00',
        low52: '$138.80',
        yield: 'Yok',
        risk: 'Yüksek',
        comment: 'Batarya üretimindeki tedarik zinciri darboğazları teslimat hızını yavaşlatıyor. 180$ desteği kritik, yakından izlenmeli.',
        sentimentBullish: 30,
        sentimentBearish: 50
      },
      BIST100: {
        name: 'BIST 100 Endeksi',
        pe: '11.8',
        marketCap: '$345.0 B',
        high52: '10,254',
        low52: '7,203',
        yield: '%2.1',
        risk: 'Orta',
        comment: 'Yabancı yatırımcı girişlerinin devamıyla yükseliş trendini koruyor. 9,200 puan seviyesi güçlü bir destek noktası.',
        sentimentBullish: 65,
        sentimentBearish: 15
      },
      GOLD: {
        name: 'Altın Ons Fiyatı',
        pe: 'N/A',
        marketCap: 'N/A',
        high52: '$2,483',
        low52: '$1,915',
        yield: 'Yok',
        risk: 'Çok Düşük',
        comment: 'Fed faiz indirim beklentileri ve jeopolitik endişelerle güvenli liman talebi tarihi zirveyi desteklemeye devam ediyor.',
        sentimentBullish: 85,
        sentimentBearish: 5
      }
    };

    return data[ticker] || defaultDetails;
  };

  const handleSuggestionClick = (ticker, sector) => {
    setNewTicker(ticker);
    setNewSector(sector);
  };

  // Real-time regex validation (Ticker should only contain letters)
  const isInvalidTicker = newTicker.trim() && !/^[A-Za-z]+$/.test(newTicker.trim());

  // Find selected asset details & price history
  const activeDetails = selectedAsset ? getAssetDetails(selectedAsset.ticker) : null;
  const activeMarketData = selectedAsset ? marketData.find(d => d.ticker === selectedAsset.ticker) : null;

  return (
    <div className="watchlist-tab-layout">
      {/* List Card */}
      <div className="glass-card watchlist-main">
        <div className="watchlist-header">
          <h2 className="tab-title">
            <Sliders size={18} className="text-gold" />
            Takip Listem (Portfolio)
          </h2>
          {apiLoading && <RefreshCw size={14} className="animate-spin text-gold" />}
        </div>
        
        {watchlistMsg && (
          <div className="status-notification">
            {watchlistMsg}
          </div>
        )}

        <div className="watchlist-grid">
          {watchlist.length === 0 ? (
            <div className="watchlist-empty-state">
              <h3>🎯 Piyasa Gürültüsünü Kapatın</h3>
              <p className="empty-state-text">
                Portföyünüzün risk durumunu hesaplamak ve 90 saniyelik AI piyasa bülteninizi oluşturmak için takip listesine hisse ekleyerek başlayın:
              </p>
              <div className="quick-add-presets">
                <button type="button" onClick={() => onQuickAdd('NVDA', 'Teknoloji')} className="quick-add-preset-btn">
                  ➕ NVDA (Nvidia)
                </button>
                <button type="button" onClick={() => onQuickAdd('AAPL', 'Teknoloji')} className="quick-add-preset-btn">
                  ➕ AAPL (Apple)
                </button>
                <button type="button" onClick={() => onQuickAdd('TSLA', 'Otomotiv')} className="quick-add-preset-btn">
                  ➕ TSLA (Tesla)
                </button>
                <button type="button" onClick={() => onQuickAdd('BIST100', 'Finans / Bankacılık')} className="quick-add-preset-btn">
                  ➕ BIST100 (Bist)
                </button>
                <button type="button" onClick={() => onQuickAdd('GOLD', 'Emtia')} className="quick-add-preset-btn">
                  ➕ GOLD (Altın)
                </button>
              </div>
            </div>
          ) : (
            watchlist.map(item => {
              const data = marketData.find(d => d.ticker === item.ticker);
              const isPositive = data ? data.change_pct >= 0 : true;
              const mergedAsset = { ...item, price: data ? data.price : '0.00', change_pct: data ? data.change_pct : '0.00' };
              const isSelected = selectedAsset && selectedAsset.ticker === item.ticker;

              return (
                <div 
                  key={item.watchlist_id} 
                  className={`watchlist-card-item clickable-asset-card ${isSelected ? 'selected-card' : ''}`} 
                  onClick={() => onAssetSelect(mergedAsset)}
                  title="Detaylı Analiz Gör"
                >
                  <div className="watchlist-card-header">
                    <div>
                      <h3 className="ticker-title">{item.ticker}</h3>
                      <span className="ticker-sector">{item.sector}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent details panel from updating
                        if (isSelected) setSelectedAsset(null);
                        handleRemoveWatchlist(item.watchlist_id, item.ticker);
                      }}
                      className="btn-delete"
                      title="Listeden Kaldır"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {data ? (
                    <div className="watchlist-card-body">
                      <div className="sparkline-container">
                        <svg className="sparkline-svg" viewBox="0 0 100 30">
                          <path 
                            d={getSparklinePath(data.history, 100, 30)} 
                            fill="none" 
                            stroke={isPositive ? "var(--color-bullish)" : "var(--color-bearish)"} 
                            strokeWidth="2.5"
                          />
                        </svg>
                      </div>
                      
                      <div className="price-info">
                        <span className="current-price">${data.price.toLocaleString()}</span>
                        <span className={`price-change ${isPositive ? 'text-bullish' : 'text-bearish'}`}>
                          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {isPositive ? '+' : ''}{data.change_pct}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="loading-data">Veriler yükleniyor...</div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Sidebar: Dynamic add form OR asset detail drawer */}
      <div className="watchlist-control-panel glass-card">
        {selectedAsset && activeDetails ? (
          /* ── DETAY PANELİ GÖRÜNÜMÜ ────────────────────────────────────── */
          <div className="asset-details-drawer">
            <div className="drawer-header">
              <div>
                <span className="drawer-subtitle">{selectedAsset.sector || 'Sektör Kodu'}</span>
                <h2 className="drawer-title">{selectedAsset.ticker}</h2>
                <p className="company-fullname">{activeDetails.name}</p>
              </div>
              <button 
                onClick={() => setSelectedAsset(null)}
                className="btn-drawer-close"
                title="Detayları Kapat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Dynamic Price Area */}
            <div className="drawer-price-section">
              <span className="drawer-price">${parseFloat(selectedAsset.price).toLocaleString()}</span>
              <span className={`drawer-pct ${parseFloat(selectedAsset.change_pct) >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                {parseFloat(selectedAsset.change_pct) >= 0 ? '+' : ''}{selectedAsset.change_pct}%
              </span>
            </div>

            {/* Large high-fidelity Price Graph */}
            {activeMarketData && activeMarketData.history && (
              <div className="drawer-chart-container">
                <svg className="drawer-chart-svg" viewBox="0 0 240 70">
                  <path 
                    d={getSparklinePath(activeMarketData.history, 240, 70)} 
                    fill="none" 
                    stroke={parseFloat(selectedAsset.change_pct) >= 0 ? "var(--color-bullish)" : "var(--color-bearish)"} 
                    strokeWidth="3"
                  />
                </svg>
                <div className="chart-timeline-labels">
                  <span>7 Gün Önce</span>
                  <span>Bugün</span>
                </div>
              </div>
            )}

            {/* Stats Table */}
            <div className="drawer-stats-table">
              <div className="drawer-stat-row">
                <span>F/K Oranı (P/E)</span>
                <strong>{activeDetails.pe}</strong>
              </div>
              <div className="drawer-stat-row">
                <span>Piyasa Değeri</span>
                <strong>{activeDetails.marketCap}</strong>
              </div>
              <div className="drawer-stat-row">
                <span>52 Haftalık Range</span>
                <strong>{activeDetails.low52} - {activeDetails.high52}</strong>
              </div>
              <div className="drawer-stat-row">
                <span>Risk Seviyesi</span>
                <strong style={{ color: activeDetails.sentimentBearish > 40 ? 'var(--color-bearish)' : 'var(--text-primary)' }}>
                  {activeDetails.risk}
                </strong>
              </div>
            </div>

            {/* AI Short Comment (Kısa Yorum) */}
            <div className="drawer-ai-comment-box">
              <div className="ai-comment-header">✦ Sabah AI Yorumu</div>
              <p className="ai-comment-text">{activeDetails.comment}</p>
            </div>

            {/* Drawer Actions */}
            <div className="drawer-actions-grid">
              <button 
                onClick={() => {
                  setNewsFilter(selectedAsset.ticker);
                  setActiveTab('news');
                }} 
                className="btn-drawer-action"
              >
                <Newspaper size={14} />
                Haberlerine Git
              </button>
              <button 
                onClick={() => {
                  handleSendMessage(`Bana ${selectedAsset.ticker} hissesinin risk durumunu ve son gelişmelerini analiz eder misin?`);
                  setActiveTab('chat');
                }} 
                className="btn-drawer-action chat-highlight"
              >
                <MessageSquare size={14} />
                Asistana Sor
              </button>
            </div>

            {/* Back to adding form */}
            <button 
              onClick={() => setSelectedAsset(null)}
              className="btn-drawer-back-to-add"
            >
              Yeni Varlık Ekleme Modu
            </button>
          </div>
        ) : (
          /* ── VARLIK EKLEME FORMU GÖRÜNÜMÜ ─────────────────────────────── */
          <>
            <h2 className="widget-title">Yarı Yatırım Tanımla</h2>
            <p className="widget-desc-left">
              Takip etmek istediğiniz hisse senedi (ör. TSLA, NVDA), endeks (ör. BIST100) veya emtia (ör. GOLD) kodunu girin.
            </p>

            {/* Autocomplete Preset suggestions */}
            <div className="form-suggestions-section">
              <span className="suggestions-label">Önerilen Varlıklar</span>
              <div className="suggestion-badges-container">
                {suggestions.map(sug => (
                  <button 
                    key={sug.ticker}
                    type="button"
                    onClick={() => handleSuggestionClick(sug.ticker, sug.sector)}
                    className="suggestion-badge"
                  >
                    {sug.ticker}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddWatchlist} className="add-form">
              <div className="form-group">
                <label className="form-label">Hisse/Varlık Kodu</label>
                <input 
                  type="text" 
                  placeholder="Örn: AAPL, MSFT, USDTRY" 
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value)}
                  className={`custom-input ${isInvalidTicker ? 'invalid-input-border' : ''}`}
                />
                {isInvalidTicker && (
                  <span className="validation-error-text">
                    Sadece harf karakteri girebilirsiniz. (Örn: AAPL)
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Sektör / Kategori</label>
                <div className="sector-presets-grid">
                  {sectorPresets.map(preset => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setNewSector(preset.name)}
                      className={`preset-btn ${newSector === preset.name ? 'active' : ''}`}
                    >
                      <span className="preset-icon">{preset.icon}</span>
                      <span className="preset-text">{preset.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-add-submit"
                disabled={isInvalidTicker || !newTicker.trim()}
              >
                <Plus size={16} />
                Takip Listesine Ekle
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
