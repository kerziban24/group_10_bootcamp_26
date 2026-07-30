import React from 'react';
import { Calendar, Sparkles, AlertTriangle } from 'lucide-react';
import './DailyBriefing.css';

export default function DailyBriefing({ briefing }) {

  // Custom Markdown parser helper
  const renderMarkdown = (text) => {
    if (!text) return null;
    const paragraphs = text.split('\n\n');
    return paragraphs.map((para, idx) => {
      const content = para.trim();
      if (!content) return null;

      if (content.startsWith('### ')) {
        return <h3 key={idx} className="briefing-h3">{parseBold(content.replace('### ', ''))}</h3>;
      }

      if (content.startsWith('*') || content.startsWith('-')) {
        const items = content.split('\n');
        return (
          <ul key={idx} className="briefing-ul">
            {items.map((item, i) => {
              const cleanItem = item.replace(/^[*-\s]+/, '');
              return <li key={i} className="briefing-li">{parseBold(cleanItem)}</li>;
            })}
          </ul>
        );
      }

      return <p key={idx} className="briefing-p">{parseBold(content)}</p>;
    });
  };

  const parseBold = (text) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="bold-text">{part}</strong>;
      }
      return part;
    });
  };

  // Calculate needle rotation based on sentiment risk score
  // risk_score = 0 (low risk -> Bullish/Emerald), 50 (Neutral/Yellow), 100 (high risk -> Bearish/Red)
  const calculateNeedleRotation = () => {
    const score = briefing?.risk_score ?? 50;
    const deg = ((score / 100) * 180) - 90;
    return `rotate(${deg}deg)`;
  };

  return (
    <div className="briefing-tab-layout">
      {/* Editorial Columns */}
      <div className="editorial-main glass-card">
        <div className="editorial-container">
          <div className="editorial-header">
            <div className="editorial-meta">
              <Calendar size={12} />
              Bugüne Özel Piyasa Turu • {briefing?.date}
            </div>
            <h1 className="editorial-title">Günün Piyasa Özeti</h1>
          </div>

          <div className="editorial-summary">
            {renderMarkdown(briefing?.summary_text)}
          </div>
        </div>
      </div>

      {/* Sidebar: Sentiment Gauge & Key Headlines */}
      <div className="editorial-sidebar">

        {/* Sentiment Gauge Widget */}
        <div className="glass-card flex-center">
          <h2 className="widget-title">
            <Sparkles size={14} className="text-gold" />
            Portföy Duygu Kadranı
          </h2>

          <div className="gauge-container">
            <div className="gauge-track"></div>
            <div
              className="gauge-needle"
              style={{ transform: calculateNeedleRotation() }}
            ></div>
            <div className="gauge-needle-cap"></div>
          </div>

          <div className="gauge-status">
            <span className="gauge-label">Piyasa Risk Katsayısı</span>
            <span className="gauge-value">{briefing?.risk_score}%</span>
            <span className={`gauge-verdict ${briefing?.risk_score < 30 ? "verdict-bull" : briefing?.risk_score < 60 ? "verdict-neu" : "verdict-bear"}`}>
              {briefing?.risk_score < 30 ? "Olumlu / Boğa Eğilimli" : briefing?.risk_score < 60 ? "Dengeli / Orta Risk" : "Temkinli / Koruma Odaklı"}
            </span>
          </div>
          <p className="widget-desc">
            Takip listendeki varlıkların haber akışlarına ve duygu puanlamasına göre hesaplanmış anlık risk katsayısı.
          </p>
        </div>

        {/* Hot Takeaways Box */}
        <div className="glass-card">
          <h2 className="widget-title">
            <AlertTriangle size={14} className="text-gold" />
            Bugünün 3 Önemli Başlığı
          </h2>
          <div className="takeaways-list">
            {briefing?.top_3_headlines && briefing.top_3_headlines.map((headline, idx) => (
              <div key={idx} className="takeaway-item">
                <span className="takeaway-num">0{idx + 1}</span>
                <p className="takeaway-text">{headline}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
