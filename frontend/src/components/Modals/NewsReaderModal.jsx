import React from 'react';
import { X, MessageSquare, ExternalLink, Calendar, User } from 'lucide-react';
import './NewsReaderModal.css';

export default function NewsReaderModal({ news, onClose, onAskAI }) {
  if (!news) return null;

  const generateBody = (headline, ticker) => {
    return `Bugün piyasalarda hareketliliği artıran bu gelişme, özellikle ${ticker || 'ilgili sektör'} varlıklarının kısa vadeli yönünü doğrudan etkiliyor. Analistler, bu durumun teknik destek direnç seviyelerini test edeceğini ve hacim tarafında artışa yol açacağını öngörüyor.\n\nKonuya yakın kaynaklar, bu gelişmenin orta vadede portföy genel risk dağılımına yansımasının kaçınılmaz olduğunu, yatırımcıların özellikle risk duyarlılığı yüksek varlıklarda koruyucu pozisyonlar alarak dengelenmesi gerektiğini vurguluyor.`;
  };

  const bodyText = generateBody(news.headline, news.ticker_sector);
  const score = parseFloat(news.raw_sentiment_score ?? 0);
  const sentiment = score > 0.3 ? 'Olumlu (Bullish)' : (score < -0.3 ? 'Olumsuz (Bearish)' : 'Nötr');
  const sentimentClass = score > 0.3 ? 'positive' : (score < -0.3 ? 'negative' : 'neutral');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card news-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="news-modal-top">
          <span className="news-ticker-tag">{news.ticker_sector || 'Haber'}</span>
          <div className="news-meta-row">
            <span className="news-meta-item">
              <Calendar size={12} />
              Bugün
            </span>
            <span className="news-meta-item">
              <User size={12} />
              {news.source || 'Finans Servisi'}
            </span>
          </div>
        </div>

        <h2 className="news-modal-title">{news.headline}</h2>

        <div className={`news-sentiment-alert-box ${sentimentClass}`}>
          <div className="sentiment-alert-title">AI Haber Duygu Analizi</div>
          <div className="sentiment-alert-desc">
            Bu haber, yapay zeka ajanımız tarafından <strong>{sentiment}</strong> olarak etiketlendi (Duygu Skoru: <strong>{score}</strong>).
          </div>
        </div>

        <div className="news-modal-body">
          <p>{bodyText}</p>
        </div>

        <div className="news-modal-footer">
          {news.url && (
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-news-external"
            >
              Kaynağa Git
              <ExternalLink size={13} />
            </a>
          )}
          <button
            onClick={() => {
              onAskAI(`Bana şu haberi detaylandırır mısın ve portföyüme etkisini açıklar mısın: "${news.headline}"`);
              onClose();
            }}
            className="btn-news-ask-ai"
          >
            <MessageSquare size={14} />
            Haberi Asistana Sor
          </button>
        </div>
      </div>
    </div>
  );
}
