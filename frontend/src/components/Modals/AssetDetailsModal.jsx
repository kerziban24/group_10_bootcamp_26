import React from 'react';
import { X, MessageSquare, Newspaper, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import './AssetDetailsModal.css';

export default function AssetDetailsModal({ asset, onClose, onAskAI, onViewNews }) {
  if (!asset) return null;

  // Dynamically yield mock metrics based on ticker
  const getAssetDetails = (ticker) => {
    const defaultDetails = {
      pe: '18.4',
      marketCap: '$24.5 B',
      high52: '$120.00',
      low52: '$85.00',
      yield: '%1.8',
      sentimentBullish: 60,
      sentimentBearish: 20,
    };

    const data = {
      NVDA: {
        pe: '72.4',
        marketCap: '$3.15 T',
        high52: '$140.76',
        low52: '$39.23',
        yield: '%0.02',
        sentimentBullish: 80,
        sentimentBearish: 10,
      },
      AAPL: {
        pe: '31.2',
        marketCap: '$3.28 T',
        high52: '$237.49',
        low52: '$164.08',
        yield: '%0.48',
        sentimentBullish: 55,
        sentimentBearish: 15,
      },
      TSLA: {
        pe: '58.6',
        marketCap: '$562.4 B',
        high52: '$271.00',
        low52: '$138.80',
        yield: 'Yok',
        sentimentBullish: 30,
        sentimentBearish: 50,
      },
      BIST100: {
        pe: '11.8',
        marketCap: '$345.0 B',
        high52: '10,254',
        low52: '7,203',
        yield: '%2.1',
        sentimentBullish: 65,
        sentimentBearish: 15,
      },
      GOLD: {
        pe: 'N/A',
        marketCap: 'N/A',
        high52: '$2,483',
        low52: '$1,915',
        yield: 'Yok',
        sentimentBullish: 85,
        sentimentBearish: 5,
      }
    };

    return data[ticker] || defaultDetails;
  };

  const details = getAssetDetails(asset.ticker);
  const changePct = asset.change_pct ?? 0;
  const isUp = changePct >= 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card asset-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Close */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="asset-modal-header">
          <div className="asset-header-left">
            <span className="asset-details-badge">{asset.sector || 'Piyasa Varlığı'}</span>
            <h2>{asset.ticker} Detay Analizi</h2>
          </div>
          <div className="asset-header-price">
            <div className="detail-price-value">${asset.price || '0.00'}</div>
            <div className={`detail-price-change ${isUp ? 'bullish' : 'bearish'}`}>
              {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{isUp ? '+' : ''}{changePct}%</span>
            </div>
          </div>
        </div>

        {/* Quick Grid Metrics */}
        <div className="financials-grid">
          <div className="financial-cell">
            <span className="cell-label">Fiyat/Kazanç (F/K)</span>
            <span className="cell-value">{details.pe}</span>
          </div>
          <div className="financial-cell">
            <span className="cell-label">Piyasa Değeri</span>
            <span className="cell-value">{details.marketCap}</span>
          </div>
          <div className="financial-cell">
            <span className="cell-label">52 Haftalık Zirve</span>
            <span className="cell-value">{details.high52}</span>
          </div>
          <div className="financial-cell">
            <span className="cell-label">52 Haftalık Dip</span>
            <span className="cell-value">{details.low52}</span>
          </div>
          <div className="financial-cell">
            <span className="cell-label">Temettü Verimi</span>
            <span className="cell-value">{details.yield}</span>
          </div>
          <div className="financial-cell">
            <span className="cell-label">Risk Durumu</span>
            <span className="cell-value" style={{ color: details.sentimentBearish > 40 ? 'var(--color-bearish)' : 'var(--text-primary)' }}>
              {details.sentimentBearish > 40 ? 'Yüksek Risk' : 'Dengeli'}
            </span>
          </div>
        </div>

        {/* Sentiment Analysis Bar */}
        <div className="sentiment-distribution-box">
          <div className="distribution-label">
            <span>AI Haber Duygu Analizi Dağılımı</span>
            <span className="sentiment-percentage">{details.sentimentBullish}% Olumlu</span>
          </div>
          <div className="sentiment-bar-track">
            <div className="sentiment-bar-fill positive" style={{ width: `${details.sentimentBullish}%` }} title="Olumlu Haberler" />
            <div className="sentiment-bar-fill neutral" style={{ width: `${100 - details.sentimentBullish - details.sentimentBearish}%` }} title="Nötr Haberler" />
            <div className="sentiment-bar-fill negative" style={{ width: `${details.sentimentBearish}%` }} title="Olumsuz Haberler" />
          </div>
          <div className="sentiment-bar-legend">
            <span className="legend-dot positive">Olumlu</span>
            <span className="legend-dot neutral">Nötr</span>
            <span className="legend-dot negative">Olumsuz</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="asset-modal-actions">
          <button 
            onClick={() => {
              onViewNews(asset.ticker);
              onClose();
            }} 
            className="btn-modal-action news-btn"
          >
            <Newspaper size={15} />
            Haberlerini Gör
          </button>
          
          <button 
            onClick={() => {
              onAskAI(`Bana ${asset.ticker} hissesinin bugünkü risk analizini ve gelecek beklentilerini söyler misin?`);
              onClose();
            }} 
            className="btn-modal-action ask-btn"
          >
            <MessageSquare size={15} />
            Asistana Sor
          </button>
        </div>
      </div>
    </div>
  );
}
