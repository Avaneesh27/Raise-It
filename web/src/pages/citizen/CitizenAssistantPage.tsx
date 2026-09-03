import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Shield,
  HelpCircle,
  FileText,
  Building2,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { ragApi } from '../../services/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: any[];
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  'What happens after submitting a complaint?',
  'What is the standard SLA for fixing a pothole?',
  'What are the penalties for illegal garbage dumping?',
  'How does the recurring defect prioritization work?'
];

export const CitizenAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your RaiseIt Civic Knowledge Assistant. You can ask me questions regarding official municipal procedures, resolution SLAs, grievance escalation rules, or how your complaint is prioritized.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await ragApi.query(q);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.data.answer || "I couldn't find sufficient information in verified civic documents.",
        sources: res.data.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Unable to reach the civic knowledge base. Please verify network connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-[#131b2e] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Civic Knowledge Assistant
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Grounded on verified municipal SOPs and Citizen Grievance Charters</span>
          </p>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Suggested Queries:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-left p-3 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 text-xs text-slate-700 dark:text-slate-300 transition shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 min-h-[420px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[480px] pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-[#0d1322] text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Sources Citation */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Verified Citations:
                    </span>
                    {m.sources.map((src, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <FileText className="w-3 h-3 text-purple-500" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {src.documentName}
                        </span>
                        <span>• {src.pageOrSection}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Retrieving grounded answer from municipal charters...</span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about municipal rules or your complaint..."
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-[#0d1322] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
