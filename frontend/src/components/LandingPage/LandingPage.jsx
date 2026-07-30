import React, { useState } from 'react';
import { Coffee, ArrowRight, ShieldCheck, Sparkles, MessageSquare, AlertTriangle, RefreshCw } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage({ onStart, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tone, setTone] = useState('detaylı');
  const [formError, setFormError] = useState('');

  // Loading/Preparing screen states
  const [isPreparing, setIsPreparing] = useState(false);
  const [preparingText, setPreparingText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim() || !email.includes('@')) {
      setFormError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    if (!password || password.length < 4) {
      setFormError('Şifre en az 4 karakter olmalıdır.');
      return;
    }

    if (!isLogin && !name.trim()) {
      setFormError('Lütfen adınızı soyadınızı girin.');
      return;
    }

    // Trigger full loading overlay
    setIsPreparing(true);
    const steps = [
      "Kahveniz demleniyor... ☕",
      "Piyasa verileriniz taranıyor... 📊",
      "AI sabah brifinginiz hazırlanıyor... 🛡️"
    ];
    setPreparingText(steps[0]);

    const t1 = setTimeout(() => setPreparingText(steps[1]), 800);
    const t2 = setTimeout(() => setPreparingText(steps[2]), 1600);

    const onComplete = (success) => {
      if (!success) {
        clearTimeout(t1);
        clearTimeout(t2);
        setIsPreparing(false);
      }
    };

    if (isLogin) {
      onLogin({ email: email.trim(), password }, (err) => {
        setFormError(err);
        onComplete(false);
      }, () => {
        // Successful login transition
        setTimeout(() => setIsPreparing(false), 2400);
      });
    } else {
      onStart({
        name: name.trim(),
        email: email.trim(),
        password,
        tone_preference: tone
      }, (err) => {
        setFormError(err);
        onComplete(false);
      }, () => {
        // Successful signup transition
        setTimeout(() => setIsPreparing(false), 2400);
      });
    }
  };

  return (
    <div className="landing-layout">
      {/* Immersive Coffee-Pouring Onboarding Loader */}
      {isPreparing && (
        <div className="preparing-overlay">
          <div className="preparing-card">

            {/* SVG Coffee Pouring Scene */}
            <div className="coffee-scene">
              <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="coffee-svg">

                {/* ── Cezve (kahve ibriği) ── */}
                <g className="pour-pot">
                  {/* Gövde */}
                  <rect x="110" y="30" width="52" height="44" rx="10" fill="#6b3f1f" />
                  {/* Kapak */}
                  <rect x="108" y="24" width="56" height="10" rx="5" fill="#8b5a2b" />
                  <circle cx="136" cy="24" r="4" fill="#d4a373" />
                  {/* Sap */}
                  <path d="M162 38 Q180 38 180 52 Q180 66 162 66" stroke="#8b5a2b" strokeWidth="5" fill="none" strokeLinecap="round" />
                  {/* Ağız / emzik */}
                  <path d="M110 58 Q96 60 90 72" stroke="#6b3f1f" strokeWidth="7" fill="none" strokeLinecap="round" />
                  <circle cx="88" cy="74" r="4" fill="#5a3010" />
                </g>

                {/* ── Kahve akışı ── */}
                <g className="coffee-stream">
                  {/* Ana akış */}
                  <path
                    d="M88 78 Q85 100 83 118 Q81 132 82 145"
                    stroke="#6b3f1f"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    className="stream-main"
                  />
                  {/* İnce yan damlacık */}
                  <path
                    d="M91 80 Q90 108 89 128 Q88 138 88 148"
                    stroke="#8b5a2b"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    className="stream-thin"
                  />
                  {/* Damla */}
                  <ellipse cx="83" cy="152" rx="4" ry="5" fill="#6b3f1f" className="drop-end" />
                </g>

                {/* ── Kupa ── */}
                <g>
                  {/* Kupa gövdesi */}
                  <path d="M52 148 L56 198 Q56 204 64 204 L120 204 Q128 204 128 198 L132 148 Z" fill="#f5f0e8" stroke="#d4a373" strokeWidth="2" />
                  {/* Sap */}
                  <path d="M128 162 Q148 162 148 178 Q148 194 128 194" stroke="#d4a373" strokeWidth="5" fill="none" strokeLinecap="round" />
                  {/* Tabak */}
                  <ellipse cx="92" cy="206" rx="48" ry="6" fill="#e8dcc8" />

                  {/* Kahve dolum seviyesi — animasyonlu */}
                  <clipPath id="cup-clip">
                    <path d="M54 148 L58 198 Q58 202 64 202 L120 202 Q126 202 126 198 L130 148 Z" />
                  </clipPath>
                  <rect
                    x="54" y="148" width="76" height="56"
                    fill="#6b3f1f"
                    clipPath="url(#cup-clip)"
                    className="coffee-fill-rect"
                  />
                  {/* Köpük yüzey */}
                  <ellipse cx="92" cy="172" rx="24" ry="5" fill="#c8934a" className="foam-surface" opacity="0.7" />
                </g>

                {/* ── Buhar tütmesi ── */}
                <g className="steam-group">
                  <path d="M72 138 Q68 128 72 118 Q76 108 72 98" stroke="#c8b89a" strokeWidth="2.5" fill="none" strokeLinecap="round" className="steam s1" opacity="0" />
                  <path d="M92 136 Q88 124 92 114 Q96 104 92 94" stroke="#c8b89a" strokeWidth="2.5" fill="none" strokeLinecap="round" className="steam s2" opacity="0" />
                  <path d="M112 138 Q108 128 112 118 Q116 108 112 98" stroke="#c8b89a" strokeWidth="2.5" fill="none" strokeLinecap="round" className="steam s3" opacity="0" />
                </g>

                {/* ── Sıçrama damlaları ── */}
                <g className="splash-group">
                  <circle cx="70" cy="152" r="2.5" fill="#8b5a2b" className="splash sp1" opacity="0" />
                  <circle cx="108" cy="150" r="2" fill="#8b5a2b" className="splash sp2" opacity="0" />
                  <circle cx="78" cy="147" r="1.5" fill="#6b3f1f" className="splash sp3" opacity="0" />
                </g>
              </svg>
            </div>

            <h2 className="preparing-title">Sabah Turu Hazırlanıyor</h2>
            <p className="preparing-step-text">{preparingText}</p>

            {/* İlerleme çizgisi */}
            <div className="preparing-progress-bar">
              <div className="preparing-progress-fill" />
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="landing-top-header">
        <div className="landing-logo">
          <Coffee size={24} className="text-coffee" />
          <span>Sabah Turu</span>
        
       
         
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero-center">
        <div className="pitch-tag">Kişisel Piyasa Ajanınız 🛡️</div>
        
        <h1 className="hero-headline">
          Piyasanın gürültüsünü kapat.<br />
          <span>90 saniyede güne başla.</span>
        </h1>
        
        <p className="hero-subtext">
          Bloomberg terminali değil; sabah kahvenizi yudumlarken okuyacağınız, portföyünüze özel üretilen, önem ve duygu etiketli kişisel piyasa özetiniz.
        </p>

        {/* Minimalist Signup/Login Form Box */}
        <div className="registration-box glass-card">
          <div className="auth-tabs">
            <button 
              type="button" 
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setFormError(''); }}
            >
              Giriş Yap
            </button>
            <button 
              type="button" 
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setFormError(''); }}
            >
              Kayıt Ol
            </button>
          </div>

          {formError && (
            <div className="form-error-msg">
              <AlertTriangle size={14} />
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form-auth">
            {!isLogin && (
              <div className="form-input-wrapper fade-in-input">
                <input 
                  type="text" 
                  placeholder="Adınız Soyadınız" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="custom-input auth-input"
                  required
                />
              </div>
            )}
            
            <div className="form-input-wrapper">
              <input 
                type="email" 
                placeholder="E-Posta Adresiniz" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="custom-input auth-input"
                required
              />
            </div>

            <div className="form-input-wrapper">
              <input 
                type="password" 
                placeholder="Şifreniz" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="custom-input auth-input"
                required
              />
            </div>
            
            {!isLogin && (
              <div className="form-input-wrapper fade-in-input">
                <select 
                  value={tone} 
                  onChange={(e) => setTone(e.target.value)} 
                  className="custom-select auth-select"
                >
                  <option value="detaylı">Detaylı Özet</option>
                  <option value="kısa">Hızlı Özet</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn-start-submit-auth">
              {isLogin ? "Giriş Yap" : "Kahveni Kap ve Başla"}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* Sharp 3-Feature Showcase */}
      <section className="landing-highlights">
        <div className="highlight-card">
          <div className="highlight-icon">
            <Sparkles size={20} className="text-coffee" />
          </div>
          <h3>90 Saniyelik Brifing</h3>
          <p>Gece boyu fiyatları ve haberleri tarayıp portföyünüze göre yazılan kısa, net sabah özeti.</p>
        </div>

        <div className="highlight-card">
          <div className="highlight-icon">
            <ShieldCheck size={20} className="text-coffee" />
          </div>
          <h3>Duygu & Önem Etiketleri</h3>
          <p>Haberler boğa (Bullish) veya ayı (Bearish) etkilerine göre puanlanır, riskleri anında görürsünüz.</p>
        </div>

        <div className="highlight-card">
          <div className="highlight-icon">
            <MessageSquare size={20} className="text-coffee" />
          </div>
          <h3>Sorgulanabilir Portföy</h3>
          <p>"Bugün en riskli pozisyonum ne?" diye sorabileceğiniz AI asistanı her an sizinle.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Sabah Turu © 2026. Gürültüyü kapat, sabahını yönet.</p>
      </footer>
    </div>
  );
}
