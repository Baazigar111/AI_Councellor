"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import UniversityCard from '@/components/UniversityCard';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Task {
  id: number;
  title: string;
  is_completed: boolean;
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState('LOADING...');
  const [isTyping, setIsTyping] = useState(false);
  const [shortlist, setShortlist] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]); 
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // --- ALL LOGIC PRESERVED ---
  const syncChatAndStatus = useCallback(async () => {
    try {
      const history = await apiRequest('/ai/history');
      setMessages(history.length > 0 ? history : [{ role: 'assistant', content: "Hello! Ready to explore your 20 university options?" }]);

      const userData = await apiRequest('/user/me');
      setStage(userData.current_stage);
      setShortlist(userData.shortlisted_universities || []);
      setTasks(userData.tasks || []); 
    } catch (err) {
      console.error("Sync failed");
    }
  }, []);

  const toggleTask = async (taskId: number) => {
    try {
      await apiRequest(`/user/tasks/${taskId}/toggle`, { method: 'POST' });
      syncChatAndStatus();
    } catch (err) {
      console.error("Failed to toggle task status");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    syncChatAndStatus();
  }, [router, syncChatAndStatus]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const data = await apiRequest('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: currentInput }),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      if (data.next_stage) setStage(data.next_stage);
      syncChatAndStatus();
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'system', content: err.message }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRemoveFromShortlist = async (uniId: number) => {
    try {
      await apiRequest(`/user/shortlist/${uniId}`, { method: 'POST' });
      syncChatAndStatus();
    } catch (err) {
      console.error("Removal failed");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar - Pro Version */}
      <aside className="w-85 bg-[#0f172a] p-6 flex flex-col shadow-2xl z-30">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
            <span className="text-white text-xl">🎓</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Counsellor</h1>
        </div>

        {/* Pro Navigation */}
        <div className="space-y-2 mb-10">
          <button onClick={() => router.push('/discovery')} className="w-full group flex items-center justify-between p-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 text-white font-semibold text-sm">
            <span>Explore Universities</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <button onClick={() => router.push('/locker')} className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all text-sm font-medium">
            <span className="text-lg">📁</span>
            <span>Document Locker</span>
          </button>
        </div>
        
        {/* Stage - Clean Tag */}
        <div className="mb-10 px-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Your Journey</p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
             {stage.replace(/_/g, ' ')}
          </div>
        </div>

        {/* AI To-Do List - Organized */}
        <div className="mb-10 px-2 flex-1 overflow-y-auto no-scrollbar">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Milestones</p>
          <div className="space-y-2.5">
            {tasks.length > 0 ? tasks.map(task => (
              <label key={task.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={task.is_completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-4 h-4 rounded-md border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 cursor-pointer"
                />
                <span className={`text-xs ${task.is_completed ? 'line-through text-slate-600' : 'text-slate-300'} transition-all`}>
                  {task.title}
                </span>
              </label>
            )) : (
              <div className="text-center py-4 rounded-xl border border-dashed border-slate-800">
                 <p className="text-[10px] text-slate-600 italic">Chat to unlock tasks</p>
              </div>
            )}
          </div>
        </div>

        {/* Shortlist - Minimalist */}
        <div className="px-2 pt-6 border-t border-white/5">
           <button onClick={() => { localStorage.removeItem('token'); router.push('/login'); }} className="text-slate-500 hover:text-red-400 transition-colors text-xs font-semibold flex items-center gap-2">
             Sign Out
           </button>
        </div>
      </aside>

      {/* Main Chat Area - Minimal & Clean */}
      <main className="flex-1 flex flex-col relative bg-[#f8fafc]">
        {/* Chat History Container */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-slide-up`}>
                <div className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-200' 
                  : m.role === 'system' 
                  ? 'bg-red-50 text-red-600 border border-red-100 text-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 shadow-slate-100'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 px-1 uppercase font-bold tracking-tighter">
                  {m.role === 'assistant' ? 'Counsellor' : m.role === 'user' ? 'You' : 'System'}
                </span>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 w-fit">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thinking</span>
              </div>
            )}
          </div>
        </div>

        {/* Input Bar - Floating & Elegant */}
        <div className="p-8">
          <form onSubmit={onSend} className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition-all"></div>
            <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl shadow-xl p-2 pl-6 overflow-hidden">
              <input 
                className="flex-1 py-4 text-sm text-slate-800 focus:outline-none placeholder:text-slate-400" 
                placeholder="Ask about universities, visas, or your SOP..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                disabled={isTyping} 
              />
              <button 
                disabled={isTyping || !input.trim()} 
                className="bg-slate-900 hover:bg-black disabled:bg-slate-200 px-6 py-3 rounded-xl font-bold transition-all text-white text-sm"
              >
                Send
              </button>
            </div>
          </form>
          <p className="text-center mt-4 text-[10px] text-slate-400 font-medium">AI can make mistakes. Verify important application deadlines.</p>
        </div>
      </main>
    </div>
  );
}