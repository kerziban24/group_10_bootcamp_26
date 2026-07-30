import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import DailyBriefing from './components/DailyBriefing/DailyBriefing';
import Watchlist from './components/Watchlist/Watchlist';
import NewsFeed from './components/NewsFeed/NewsFeed';
import ChatAssistant from './components/ChatAssistant/ChatAssistant';
import LandingPage from './components/LandingPage/LandingPage';
import NewsReaderModal from './components/Modals/NewsReaderModal';
import Toast from './components/Toast/Toast';
import {
  mockUsers, mockWatchlist, mockRawMarketData,
  mockRawNews, mockDailyBriefing, mockChatHistory
} from './mockData';
import './App.css';

const BACKEND_BASE_URL = 'http://localhost/group_10_bootcamp_26/backend';
const apiUrl = (path) => `${BACKEND_BASE_URL}/${path.replace(/^\/+/, '')}`;

const SESSION_KEY = 'sabah_turu_session';

const savedSession = (() => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
})();

export default function App() {
  const [activeTab, setActiveTab] = useState('briefing');
  const [apiLoading, setApiLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(!!savedSession);
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');

  const [user, setUser] = useState(savedSession || mockUsers[0]);
  const [tonePreference, setTonePreference] = useState(savedSession?.tone_preference || mockUsers[0].tone_preference || 'detaylı');
  const [watchlist, setWatchlist] = useState(mockWatchlist);
  const [marketData, setMarketData] = useState(mockRawMarketData);
  const [news, setNews] = useState(mockRawNews);
  const [briefing, setBriefing] = useState(mockDailyBriefing);
  const [chatHistory, setChatHistory] = useState(mockChatHistory);

  useEffect(() => {
    if (savedSession?.user_id) {
      fetchBriefingData(savedSession.user_id);
    }
  }, []);

  // Input fields
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [newTicker, setNewTicker] = useState('');
  const [newSector, setNewSector] = useState('Teknoloji');

  // Interactive Action States
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [watchlistMsg, setWatchlistMsg] = useState('');

  // Dynamic UI States
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsFilter, setNewsFilter] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }]);
  };
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerWelcomeOverlay = (name) => {
    setWelcomeName(name || 'Kullanıcı');
    setShowWelcomeOverlay(true);
    window.setTimeout(() => setShowWelcomeOverlay(false), 1800);
  };

  // ─── Kayıt Ol ─────────────────────────────────────────────────────────────
  const handleStart = async (userData, onFailure, onSuccess) => {
    try {
      const res = await fetch(apiUrl('register.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!data.success) {
        onFailure(data.message || 'Kayıt işlemi başarısız oldu.');
        return;
      }
      userData = { ...userData, user_id: data.user.user_id };
    } catch (err) {
      onFailure('Sunucuya bağlanılamadı. Lütfen sunucunun çalıştığını kontrol edin.');
      return;
    }

    setUser(userData);
    setTonePreference(userData.tone_preference || 'detaylı');
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    fetchBriefingData(userData.user_id);
    if (onSuccess) onSuccess();
    setTimeout(() => {
      setShowDashboard(true);
      addToast('Hesabınız başarıyla oluşturuldu! Hoş geldiniz.', 'success');
      triggerWelcomeOverlay(userData.name || 'Kullanıcı');
    }, 2400);
  };

  // ─── Giriş Yap ────────────────────────────────────────────────────────────
  const handleLogin = async (credentials, onFailure, onSuccess) => {
    try {
      const res = await fetch(apiUrl('login.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (!data.success) {
        onFailure(data.message || 'E-Posta veya şifre hatalı.');
        return;
      }
      const loggedUser = data.user;
      setUser(loggedUser);
      setTonePreference(loggedUser.tone_preference || 'detaylı');
      localStorage.setItem(SESSION_KEY, JSON.stringify(loggedUser));
      fetchBriefingData(loggedUser.user_id);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setShowDashboard(true);
        addToast('Başarıyla giriş yapıldı!', 'success');
        triggerWelcomeOverlay(loggedUser.name || 'Kullanıcı');
      }, 2400);
    } catch (err) {
      onFailure('Sunucuya bağlanılamadı. Lütfen sunucunun çalıştığını kontrol edin.');
    }
  };

  // ─── Çıkış Yap ────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(mockUsers[0]);
    setTonePreference(mockUsers[0].tone_preference || 'detaylı');
    setWatchlist(mockWatchlist);
    setMarketData(mockRawMarketData);
    setNews(mockRawNews);
    setBriefing(mockDailyBriefing);
    setChatHistory(mockChatHistory);
    setActiveTab('briefing');
    setShowDashboard(false);
    setShowWelcomeOverlay(false);
    setWelcomeName('');
  };

  // ─── Veri Yükleme: Gerçek API → Bağlanamazsa Fallback ────────────────────
  const fetchBriefingData = async (userId) => {
    const uid = userId || user?.user_id || 'usr_001';
    setApiLoading(true);
    try {
      // Watchlist
      const watchlistRes = await fetch(apiUrl('watchlist.php'), {
        headers: { 'X-User-Id': uid }
      });
      if (watchlistRes.ok) {
        const wlData = await watchlistRes.json();
        if (Array.isArray(wlData) && wlData.length > 0) {
          setWatchlist(wlData);
        } else {
          setWatchlist(mockWatchlist);
        }
      } else {
        setWatchlist(mockWatchlist);
      }

      // Brifing + Market + Haberler
      const briefingRes = await fetch(apiUrl('briefing.php'), {
        headers: { 'X-User-Id': uid }
      });
      if (briefingRes.ok) {
        const bData = await briefingRes.json();
        if (bData?.briefing)   setBriefing(bData.briefing);
        else                   setBriefing(mockDailyBriefing);
        if (bData?.marketData && bData.marketData.length > 0) setMarketData(bData.marketData);
        else                                                    setMarketData(mockRawMarketData);
        if (bData?.news && bData.news.length > 0) setNews(bData.news);
        else                                       setNews(mockRawNews);
      } else {
        setBriefing(mockDailyBriefing);
        setMarketData(mockRawMarketData);
        setNews(mockRawNews);
      }
    } catch (error) {
      // Sunucu kapalıysa sessizce fallback — kullanıcıya teknik hata gösterme
      setWatchlist(mockWatchlist);
      setBriefing(mockDailyBriefing);
      setMarketData(mockRawMarketData);
      setNews(mockRawNews);
    } finally {
      setApiLoading(false);
    }
  };

  // ─── Ton Tercihi ──────────────────────────────────────────────────────────
  const handleToneChange = async (newTone) => {
    setTonePreference(newTone);
    try {
      await fetch(apiUrl('user_preference.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user?.user_id || 'usr_001'
        },
        body: JSON.stringify({ tone_preference: newTone })
      });
      addToast('Bülten okuma tercihiniz güncellendi.', 'success');
      fetchBriefingData();
    } catch (e) {
      // Sessizce devam et
    }
  };

  // ─── Watchlist Ekle ───────────────────────────────────────────────────────
  const handleAddWatchlist = async (e) => {
    e.preventDefault();
    if (!newTicker.trim()) return;
    const tickerUpper = newTicker.trim().toUpperCase();

    try {
      const response = await fetch(apiUrl('watchlist.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user?.user_id || 'usr_001'
        },
        body: JSON.stringify({ ticker: tickerUpper, sector: newSector })
      });
      const result = await response.json();
      if (result.success) {
        fetchBriefingData();
        setNewTicker('');
        addToast(`${tickerUpper} takip listenize eklendi!`, 'success');
      } else {
        addToast(result.message || 'Ekleme başarısız.', 'error');
      }
    } catch (err) {
      // Sunucu kapalıysa optimistik güncelleme yap
      const newItem = {
        watchlist_id: 'wl_' + Date.now(),
        user_id: user?.user_id || 'usr_001',
        ticker: tickerUpper,
        sector: newSector,
        added_at: new Date().toISOString().split('T')[0]
      };
      setWatchlist(prev => [...prev, newItem]);
      const newPrice = {
        date: new Date().toISOString().split('T')[0],
        ticker: tickerUpper,
        price: parseFloat((Math.random() * 500 + 50).toFixed(2)),
        change_pct: parseFloat((Math.random() * 6 - 3).toFixed(2)),
        volume: '12.5M',
        history: Array.from({ length: 7 }, () => Math.random() * 100 + 100)
      };
      setMarketData(prev => [...prev, newPrice]);
      setNewTicker('');
      addToast(`${tickerUpper} takip listenize eklendi!`, 'success');
    }
  };

  // ─── Watchlist Sil ────────────────────────────────────────────────────────
  const handleRemoveWatchlist = async (id, ticker) => {
    try {
      const response = await fetch(`${apiUrl('watchlist.php')}?id=${id}`, {
        method: 'DELETE',
        headers: { 'X-User-Id': user?.user_id || 'usr_001' }
      });
      const result = await response.json();
      if (result.success) {
        fetchBriefingData();
        addToast(`${ticker} takip listenizden kaldırıldı.`, 'info');
      } else {
        addToast(result.message || 'Kaldırılamadı.', 'error');
      }
    } catch (err) {
      // Optimistik sil
      setWatchlist(prev => prev.filter(item => item.watchlist_id !== id));
      setMarketData(prev => prev.filter(d => d.ticker !== ticker));
      addToast(`${ticker} takip listenizden kaldırıldı.`, 'info');
    }
  };

  // ─── E-Posta Gönder ───────────────────────────────────────────────────────
  const triggerEmailSimulation = async () => {
    setEmailLoading(true);
    setEmailSent(false);
    try {
      const response = await fetch(apiUrl('send_email.php'), {
        method: 'POST',
        headers: { 'X-User-Id': user?.user_id || 'usr_001' }
      });
      const result = await response.json();
      if (result.success) {
        setEmailSent(true);
        addToast('Sabah brifinginiz başarıyla e-posta adresinize gönderildi!', 'success');
      } else {
        addToast('E-posta gönderilemedi: ' + (result.message || ''), 'error');
      }
    } catch (e) {
      addToast('E-posta sunucusu şu anda erişilemiyor.', 'error');
    } finally {
      setEmailLoading(false);
      setTimeout(() => setEmailSent(false), 5000);
    }
  };

  // ─── Chat Asistanı ────────────────────────────────────────────────────────
  const handleSendMessage = async (customMessage = null) => {
    const textToSend = customMessage || chatInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      chat_id: 'ch_' + Date.now(),
      user_id: user?.user_id || 'usr_001',
      question: textToSend,
      answer: 'Analiz ediliyor...',
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      clicked_topics: ''
    };

    setChatHistory(prev => [...prev, userMsg]);
    if (!customMessage) setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch(apiUrl('chat.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user?.user_id || 'usr_001'
        },
        body: JSON.stringify({ question: textToSend })
      });
      const result = await response.json();
      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].answer = result.answer || 'Cevap alınamadı.';
        updated[updated.length - 1].ai_source = result.ai_source || 'groq';
        return updated;
      });
    } catch (err) {
      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].answer = 'Yapay zeka şu anda erişilemiyor. Lütfen daha sonra tekrar deneyin.';
        return updated;
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  // ─── Varlık Seç ───────────────────────────────────────────────────────────
  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    setNewsFilter(asset.ticker);
    setChatInput(`Bana ${asset.ticker} hissesinin risk analizini ve genel durumunu detaylandırır mısın?`);
  };

  // ─── Hızlı Ekle ───────────────────────────────────────────────────────────
  const handleQuickAdd = async (ticker, sector) => {
    if (watchlist.some(item => item.ticker === ticker)) {
      addToast(`${ticker} zaten takip listenizde bulunuyor.`, 'info');
      return;
    }
    try {
      const response = await fetch(apiUrl('watchlist.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user?.user_id || 'usr_001'
        },
        body: JSON.stringify({ ticker, sector })
      });
      const result = await response.json();
      if (result.success) {
        fetchBriefingData();
        addToast(`${ticker} takip listenize eklendi!`, 'success');
      } else {
        addToast(result.message || 'Ekleme başarısız.', 'error');
      }
    } catch (err) {
      const newItem = {
        watchlist_id: 'wl_' + Date.now(),
        user_id: user?.user_id || 'usr_001',
        ticker,
        sector,
        added_at: new Date().toISOString().split('T')[0]
      };
      setWatchlist(prev => [...prev, newItem]);
      const newPrice = {
        date: new Date().toISOString().split('T')[0],
        ticker,
        price: parseFloat((Math.random() * 500 + 50).toFixed(2)),
        change_pct: parseFloat((Math.random() * 6 - 3).toFixed(2)),
        volume: '12.5M',
        history: Array.from({ length: 7 }, () => Math.random() * 100 + 100)
      };
      setMarketData(prev => [...prev, newPrice]);
      addToast(`${ticker} takip listenize eklendi!`, 'success');
    }
  };

  // ─── Sekme İçeriği ────────────────────────────────────────────────────────
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'briefing':
        return <DailyBriefing briefing={briefing} />;
      case 'watchlist':
        return (
          <Watchlist
            watchlist={watchlist}
            marketData={marketData}
            apiLoading={apiLoading}
            watchlistMsg={watchlistMsg}
            newTicker={newTicker}
            setNewTicker={setNewTicker}
            newSector={newSector}
            setNewSector={setNewSector}
            handleAddWatchlist={handleAddWatchlist}
            handleRemoveWatchlist={handleRemoveWatchlist}
            onAssetSelect={handleAssetSelect}
            onQuickAdd={handleQuickAdd}
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
            handleSendMessage={handleSendMessage}
            setActiveTab={setActiveTab}
            setNewsFilter={setNewsFilter}
          />
        );
      case 'news':
        return (
          <NewsFeed
            news={news}
            handleSendMessage={handleSendMessage}
            setActiveTab={setActiveTab}
            onNewsSelect={setSelectedNews}
            newsFilter={newsFilter}
            setNewsFilter={setNewsFilter}
          />
        );
      case 'chat':
        return (
          <ChatAssistant
            chatHistory={chatHistory}
            chatInput={chatInput}
            setChatInput={setChatInput}
            isChatLoading={isChatLoading}
            handleSendMessage={handleSendMessage}
          />
        );
      default:
        return <DailyBriefing briefing={briefing} />;
    }
  };

  return (
    <div className="app-container">
      {showWelcomeOverlay && (
        <div className="welcome-overlay">
          <div className="welcome-card">
            <p className="welcome-label">Hoş geldiniz</p>
            <h2>{welcomeName}</h2>
          </div>
        </div>
      )}

      {!showDashboard ? (
        <LandingPage onStart={handleStart} onLogin={handleLogin} />
      ) : (
        <>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tonePreference={tonePreference}
            handleToneChange={handleToneChange}
            triggerEmailSimulation={triggerEmailSimulation}
            emailLoading={emailLoading}
            emailSent={emailSent}
            onLogout={handleLogout}
          />
          <main className="dashboard-content-layout">
            {renderActiveTabContent()}
          </main>
        </>
      )}

      <Toast toasts={toasts} removeToast={removeToast} />

      {selectedNews && (
        <NewsReaderModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
          onAskAI={(questionText) => {
            setActiveTab('chat');
            handleSendMessage(questionText);
          }}
        />
      )}
    </div>
  );
}
