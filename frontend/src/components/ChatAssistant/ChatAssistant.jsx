import React, { useEffect, useRef } from 'react';
import { MessageSquare, Send, RefreshCw, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ChatAssistant.css';

export default function ChatAssistant({
  chatHistory,
  chatInput,
  setChatInput,
  isChatLoading,
  handleSendMessage
}) {
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat history on update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatLoading]);

  const quickPrompts = [
    { text: "Bugün en riskli pozisyonum ne?", emoji: "⚠️" },
    { text: "Watchlist'imdeki hisselerin duygu analizi ne durumda?", emoji: "📊" },
    { text: "Altın fiyatlarındaki yükselişin nedeni ne?", emoji: "🪙" },
    { text: "Nvidia Blackwell haberi ne anlama geliyor?", emoji: "💻" }
  ];

  const onKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-tab-layout glass-card">
      <div className="chat-header">
        <h2 className="tab-title">
          <MessageSquare size={18} className="text-gold" />
          AI Asistan
        </h2>
        <p className="tab-desc">
          Portföyünüzün risk durumunu, varlık detaylarını veya bugünkü brifingde yer alan konuları doğal dilde yapay zeka ajanımıza sorabilirsiniz.
        </p>
      </div>

      <div className="chat-body-container">
        {/* Left Column: Quick Actions & Instructions */}
        <div className="chat-quick-actions">
          <h3 className="section-title">Hızlı Sorular</h3>
          <div className="quick-prompts-grid">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt.text)}
                className="quick-prompt-card"
              >
                <span className="prompt-emoji">{prompt.emoji}</span>
                <span className="prompt-text">{prompt.text}</span>
              </button>
            ))}
          </div>
          <div className="chat-instructions">
            <h4>💡 İpuçları</h4>
            <ul>
              <li>"Nvidia hisselerini incele" diyerek fiyat ve sentiment skoruna ulaşabilirsiniz.</li>
              <li>"Altın neden yükseldi?" yazarak gecelik emtia analizini görebilirsiniz.</li>
              <li>"Risk durumunu özetle" diyerek portföy korumasını kontrol edebilirsiniz.</li>
            </ul>
          </div>

          {/* Groq AI Badge */}
          <div className="ai-powered-badge">
            <Sparkles size={13} />
            <span>Llama 3.3 · 70B ile güçlendirilmiştir</span>
          </div>
        </div>

        {/* Right Column: Chat Interface */}
        <div className="chat-interface-box">
          <div className="chat-messages-container">
            {chatHistory.map((chat) => (
              <React.Fragment key={chat.chat_id}>
                {/* User Message */}
                <div className="message-row user-row">
                  <div className="bubble user-bubble">{chat.question}</div>
                  <span className="bubble-sender">Kullanıcı</span>
                </div>

                {/* AI Message with Markdown rendering */}
                <div className="message-row ai-row">
                  <div className="bubble ai-bubble ai-markdown">
                    {chat.answer.startsWith("Yapay zeka asistanı") ? (
                      <span className="loading-answer">
                        <RefreshCw size={12} className="animate-spin text-gold" />
                        {chat.answer}
                      </span>
                    ) : (
                      <ReactMarkdown>{chat.answer}</ReactMarkdown>
                    )}
                  </div>
                  <span className="bubble-sender">
                    ✦ Sabah Turu AI
                    {chat.ai_source && chat.ai_source !== 'local_rag' && (
                      <span className="ai-source-tag"> · Groq</span>
                    )}
                  </span>
                </div>
              </React.Fragment>
            ))}

            {isChatLoading && (
              <div className="message-row ai-row">
                <div className="bubble ai-bubble loading-bubble">
                  <RefreshCw size={12} className="animate-spin text-gold" />
                  Piyasalar analiz ediliyor...
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Field */}
          <div className="chat-input-row">
            <input
              type="text"
              placeholder="Sorunuzu buraya yazın..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={onKeyPress}
              className="custom-input"
            />
            <button
              onClick={() => handleSendMessage()}
              className="btn-send"
              disabled={isChatLoading}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
