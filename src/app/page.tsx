'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism'; // CommonJS for Next.js server/client

// --- SVG Icons ---
const SendIcon = ({ className = "w-5 h-5" }: { className?: string }) => ( /* ... existing icon ... */ <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg> );
const SparkleIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( /* ... existing icon ... */ <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.502 2.657c-.996.588-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg> );
const BotIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( /* ... existing icon ... */ <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg> );
const UserIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( /* ... existing icon ... */ <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" /></svg> );
const TrashIcon = ({ className = "w-5 h-5" }: { className?: string }) => ( /* ... existing icon ... */ <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.499.058l.346-9z" clipRule="evenodd" /></svg> );
const XCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => ( /* ... existing icon ... */ <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" /></svg> );

const CopyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
  </svg>
);
const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

// --- Types & Constants (from previous version) ---
interface ChatMessage { id: string; sender: 'user' | 'ai' | 'system'; text: string; timestamp: Date; }
interface ModelOption { value: string; label: string; }
const AVAILABLE_MODELS: ModelOption[] = [ { value: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash' }, { value: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro' },];
const MAX_FREE_RESPONSES = 10;
const LOCAL_STORAGE_COUNT_KEY = 'geminiChat_dailyResponseCount';
const LOCAL_STORAGE_DATE_KEY = 'geminiChat_lastUsageDate';
const getCurrentDateString = () => new Date().toISOString().split('T')[0];


// --- CopyButton Component ---
const CodeCopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy code:", err);
      // You could add a more user-friendly error message here
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-slate-100 transition-colors text-xs"
      aria-label={copied ? "Copied code" : "Copy code"}
    >
      {copied ? <CheckIcon className="w-4 h-4 text-emerald-400" /> : <CopyIcon className="w-4 h-4" />}
    </button>
  );
};


// --- Markdown Custom Renderers ---
const markdownComponents = {
  h1: ({node, ...props}: any) => <h1 className="text-2xl font-bold my-3 text-slate-900" {...props} />,
  h2: ({node, ...props}: any) => <h2 className="text-xl font-semibold my-2.5 text-slate-800" {...props} />,
  h3: ({node, ...props}: any) => <h3 className="text-lg font-semibold my-2 text-slate-800" {...props} />,
  h4: ({node, ...props}: any) => <h4 className="text-base font-semibold my-1.5 text-slate-700" {...props} />,
  p: ({node, ...props}: any) => <p className="mb-2 leading-relaxed text-slate-700" {...props} />,
  ul: ({node, ...props}: any) => <ul className="list-disc list-inside my-2 pl-4 space-y-1 text-slate-700" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal list-inside my-2 pl-4 space-y-1 text-slate-700" {...props} />,
  li: ({node, ...props}: any) => <li className="mb-1" {...props} />,
  blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-slate-300 pl-4 italic my-2 text-slate-600 bg-slate-50 py-1" {...props} />,
  a: ({node, ...props}: any) => <a className="text-blue-600 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer" {...props} />,
  code({node, inline, className, children, ...props}: any) {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, ''); // Remove trailing newline

    return !inline ? (
      <div className="relative my-3 group">
        <SyntaxHighlighter
          style={okaidia}
          language={match ? match[1] : undefined}
          PreTag="div"
          className="rounded-md text-sm !bg-slate-800 shadow-md border border-slate-700"
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <CodeCopyButton code={codeString} />
        </div>
      </div>
    ) : (
      <code className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded-sm text-sm font-mono" {...props}>
        {children}
      </code>
    );
  },
  table: ({node, ...props}: any) => <div className="overflow-x-auto my-3"><table className="min-w-full divide-y divide-slate-300 border border-slate-300 text-sm" {...props} /></div>,
  thead: ({node, ...props}: any) => <thead className="bg-slate-100" {...props} />,
  th: ({node, ...props}: any) => <th className="px-3 py-2 text-left font-semibold text-slate-700" {...props} />,
  td: ({node, ...props}: any) => <td className="px-3 py-2 text-slate-600" {...props} />,
};


export default function Home() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[0].value);
  const [aiResponseCount, setAiResponseCount] = useState(0);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedCountStr = localStorage.getItem(LOCAL_STORAGE_COUNT_KEY);
    const storedDate = localStorage.getItem(LOCAL_STORAGE_DATE_KEY);
    const currentDate = getCurrentDateString();
    let currentDayCount = 0;
    if (storedDate === currentDate && storedCountStr) currentDayCount = parseInt(storedCountStr, 10);
    else {
      localStorage.setItem(LOCAL_STORAGE_COUNT_KEY, '0');
      localStorage.setItem(LOCAL_STORAGE_DATE_KEY, currentDate);
    }
    setAiResponseCount(currentDayCount);
    if (currentDayCount >= MAX_FREE_RESPONSES) setDailyLimitReached(true);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatHistory]);

  const handleClearInput = () => setInput('');
  const handleClearChat = () => { setChatHistory([]); setApiError(''); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || dailyLimitReached) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMessage]);
    setInput(''); setLoading(true); setApiError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.text, model: selectedModel }),
      });
      if (!res.ok) { const errorData = await res.json(); throw new Error(errorData.error || `API Error: ${res.status}`); }
      const data = await res.json();
      if (data.text) {
        const aiMessage: ChatMessage = { id: Date.now().toString() + '_ai', sender: 'ai', text: data.text, timestamp: new Date() };
        setChatHistory(prev => [...prev, aiMessage]);
        const newCount = aiResponseCount + 1;
        setAiResponseCount(newCount);
        localStorage.setItem(LOCAL_STORAGE_COUNT_KEY, newCount.toString());
        localStorage.setItem(LOCAL_STORAGE_DATE_KEY, getCurrentDateString());
        if (newCount >= MAX_FREE_RESPONSES) setDailyLimitReached(true);
      } else if (data.error) throw new Error(data.error);
      else throw new Error('Received an unexpected response from the AI.');
    } catch (err: any) {
      const errorMessage: ChatMessage = { id: Date.now().toString() + '_err', sender: 'system', text: err.message || '❌ Failed to contact AI.', timestamp: new Date() };
      setChatHistory(prev => [...prev, errorMessage]);
      setApiError(errorMessage.text);
    } finally { setLoading(false); }
  };

  const progressPercentage = Math.min((aiResponseCount / MAX_FREE_RESPONSES) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 flex flex-col items-center justify-between p-4 sm:p-6 selection:bg-blue-200 selection:text-blue-900 font-sans">
      <div className="w-full max-w-3xl flex flex-col h-[calc(100vh-3rem)] sm:h-[calc(100vh-4rem)]">
        {/* Header */}
        <header className="mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
            <div className="flex items-center gap-2.5"> <SparkleIcon className="w-8 h-8 text-amber-500" /> <h1 className="text-3xl sm:text-4xl font-semibold text-slate-800"> Gemini Chat </h1> </div>
            <div className="flex items-center gap-3">
              <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={loading || dailyLimitReached} className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 shadow-sm disabled:opacity-70">
                {AVAILABLE_MODELS.map(model => (<option key={model.value} value={model.value}>{model.label}</option>))}
              </select>
              <button onClick={handleClearChat} title="Clear Chat History" className="p-2 text-slate-500 hover:text-red-600 transition-colors rounded-md hover:bg-slate-200 disabled:opacity-50" disabled={chatHistory.length === 0 && !apiError}> <TrashIcon className="w-6 h-6" /> </button>
            </div>
          </div>
          <p className="text-slate-600 mt-1 text-xs sm:text-sm"> Ask anything using the selected Gemini model. </p>
          <div className="mt-2 sm:mt-3">
            <div className="flex justify-between text-xs text-slate-600 mb-0.5"> <span>Daily Free Responses:</span> <span>{aiResponseCount}/{MAX_FREE_RESPONSES}</span> </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5"> <div className={`h-2.5 rounded-full transition-all duration-300 ease-out ${progressPercentage >= 100 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${progressPercentage}%` }} ></div> </div>
          </div>
        </header>

        {/* Chat Display Area */}
        <main ref={chatContainerRef} className="flex-grow bg-white p-4 sm:p-6 rounded-xl shadow-lg overflow-y-auto space-y-4 scroll-smooth mb-3 sm:mb-4">
          {chatHistory.length === 0 && !loading && ( <div className="text-center text-slate-400 py-10"> <SparkleIcon className="w-16 h-16 text-slate-300 mx-auto mb-2" /> No messages yet. <br/> Start a conversation! </div> )}
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${ msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : msg.sender === 'ai' ? 'bg-slate-50 text-slate-800 rounded-bl-none border border-slate-200' : 'bg-red-100 text-red-700 border border-red-300 w-full text-center' }`}>
                <div className="flex items-start gap-2">
                  {msg.sender === 'ai' && <BotIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
                  {msg.sender === 'user' && <UserIcon className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" />}
                  
                  {msg.sender === 'ai' ? (
                    <div className="markdown-content w-full overflow-hidden"> {/* Added w-full and overflow-hidden for better layout */}
                      <ReactMarkdown
                        components={markdownComponents}
                        remarkPlugins={[remarkGfm]}
                        // eslint-disable-next-line react/no-children-prop
                        children={msg.text} // Use children prop for react-markdown v6+
                      />
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed break-words"> {msg.text} </p>
                  )}
                </div>
                <p className={`text-xs mt-1.5 ${ msg.sender === 'user' ? 'text-blue-200 text-right' : msg.sender === 'ai' ? 'text-slate-500 text-left' : 'text-red-500 text-center' }`}> {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </p>
              </div>
            </div>
          ))}
          {loading && chatHistory.length > 0 && chatHistory[chatHistory.length -1].sender === 'user' && ( /* Show loading only after user's last message */
             <div className="flex justify-start"> <div className="max-w-[85%] p-3 rounded-2xl shadow-sm bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200"> <div className="flex items-center gap-2"> <BotIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /> <div className="flex space-x-1"> <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div> <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div> <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div> </div> </div> </div> </div>
          )}
        </main>

        {/* Usage Limit Message & Input Area (same as before) */}
        {dailyLimitReached && ( <div className="mb-3 sm:mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm text-sm"> <p className="font-medium">Daily Limit Reached</p> <p>You've used all your {MAX_FREE_RESPONSES} free responses for today. Please try again tomorrow or consider our <a href="#" className="underline font-semibold hover:text-red-800">paid version</a>.</p> </div> )}
        <form onSubmit={handleSubmit} className="bg-white p-3 sm:p-4 rounded-xl shadow-xl flex items-center gap-2 sm:gap-3">
          <div className="relative flex-grow">
            <textarea id="chat-input" className={`w-full p-3 pr-10 border ${dailyLimitReached ? 'border-slate-300 bg-slate-100 cursor-not-allowed' : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm transition duration-150 ease-in-out text-base text-slate-800 placeholder-slate-400 resize-none no-scrollbar`} rows={1} style={{ maxHeight: '120px', overflowY: 'auto' }} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }} placeholder={dailyLimitReached ? "Daily limit reached" : "Ask something..."} disabled={loading || dailyLimitReached} />
            {input && !loading && !dailyLimitReached && ( <button type="button" onClick={handleClearInput} title="Clear input" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"> <XCircleIcon className="w-5 h-5" /> </button> )}
          </div>
          <button type="submit" title="Send message" className="flex-shrink-0 bg-blue-600 text-white p-3 rounded-lg font-semibold text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading || !input.trim() || dailyLimitReached}> {loading ? ( <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> ) : ( <SendIcon className="w-5 h-5" /> )} </button>
        </form>
        <footer className="mt-3 sm:mt-4 text-center"> <p className="text-xs text-slate-500"> AI response limit resets daily. <br/> Build by <a href="https://sarmadgardezi.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">Sarmad Gardezi</a> </p> </footer>
      </div>
    </div>
  );
}