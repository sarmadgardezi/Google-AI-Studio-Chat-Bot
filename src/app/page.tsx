// src/app/page.tsx
'use client';

import { useState, FormEvent, useRef, useEffect, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// --- SVG Icons ---
const SendIcon = ({ className = "w-5 h-5" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg> );
const SparkleIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.502 2.657c-.996.588-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg> );
const BotIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg> );
const UserIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" /></svg> );
const TrashIcon = ({ className = "w-5 h-5" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.499.058l.346-9z" clipRule="evenodd" /></svg> );
const XCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" /></svg> );
const CopyIcon = ({ className = "w-4 h-4" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg> );
const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> );
const ImageIcon = ({ className = "w-5 h-5" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg> );
const ChatBubbleIcon = ({ className = "w-5 h-5" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.68-3.091A9.01 9.01 0 0112 15.572V11.689c0-.97.616-1.813 1.5-2.097m-6.024 0c.884-.284 1.5-1.128 1.5-2.097V6.31c0-1.136.847-2.1 1.98-2.193.34-.027.68-.052 1.02-.072V.737c0-.607-.504-1.1-.099-1.1-.375 0-.749.042-1.114.114A9.01 9.01 0 0012 2.43M8.25 6.75h.008v.008H8.25V6.75zm0 3h.008v.008H8.25V9.75zm0 3h.008v.008H8.25v.008h.008v.008H8.25V12.75zm0 3h.008v.008H8.25V15.75zM12 11.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z" /></svg> );
const DownloadIcon = ({ className = "w-5 h-5" }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg> );


// --- Types & Constants ---
type ActiveTab = 'image' | 'chat';
interface ChatMessage { id: string; sender: 'user' | 'ai' | 'system'; text: string; type?: 'text' | 'image_prompt' | 'image_result'; timestamp: Date; imageUrl?: string; }
interface ModelOption { value: string; label: string; }
const AVAILABLE_MODELS: ModelOption[] = [ { value: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash' }, { value: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro' },];

// Chat Limits
const MAX_FREE_CHAT_RESPONSES = 10;
const LOCAL_STORAGE_CHAT_COUNT_KEY = 'moodify_dailyChatResponseCount';
const LOCAL_STORAGE_CHAT_DATE_KEY = 'moodify_lastChatUsageDate';

// Image Limits
const MAX_FREE_IMAGE_GENERATIONS = 3;
const LOCAL_STORAGE_IMAGE_COUNT_KEY = 'moodify_dailyImageGenerationCount';
const LOCAL_STORAGE_IMAGE_DATE_KEY = 'moodify_lastImageUsageDate';

const getCurrentDateString = () => new Date().toISOString().split('T')[0];

// --- CopyButton Component ---
const CodeCopyButton = ({ code }: { code: string }) => { const [copied, setCopied] = useState(false); const handleCopy = async () => { try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error("Failed to copy code:", err); } }; return ( <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-slate-100 transition-colors text-xs" aria-label={copied ? "Copied code" : "Copy code"} > {copied ? <CheckIcon className="w-4 h-4 text-emerald-400" /> : <CopyIcon className="w-4 h-4" />} </button> ); };

// --- Markdown Custom Renderers ---
const markdownComponents = { h1: ({node, ...props}: any) => <h1 className="text-2xl font-bold my-3 text-slate-900" {...props} />, h2: ({node, ...props}: any) => <h2 className="text-xl font-semibold my-2.5 text-slate-800" {...props} />, h3: ({node, ...props}: any) => <h3 className="text-lg font-semibold my-2 text-slate-800" {...props} />, h4: ({node, ...props}: any) => <h4 className="text-base font-semibold my-1.5 text-slate-700" {...props} />, p: ({node, ...props}: any) => <p className="mb-2 leading-relaxed text-slate-700" {...props} />, ul: ({node, ...props}: any) => <ul className="list-disc list-inside my-2 pl-4 space-y-1 text-slate-700" {...props} />, ol: ({node, ...props}: any) => <ol className="list-decimal list-inside my-2 pl-4 space-y-1 text-slate-700" {...props} />, li: ({node, ...props}: any) => <li className="mb-1" {...props} />, blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-slate-300 pl-4 italic my-2 text-slate-600 bg-slate-50 py-1" {...props} />, a: ({node, ...props}: any) => <a className="text-blue-600 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer" {...props} />, code({node, inline, className, children, ...props}: any) { const match = /language-(\w+)/.exec(className || ''); const codeString = String(children).replace(/\n$/, ''); return !inline ? ( <div className="relative my-3 group"> <SyntaxHighlighter style={okaidia} language={match ? match[1] : undefined} PreTag="div" className="rounded-md text-sm !bg-slate-800 shadow-md border border-slate-700" {...props} > {codeString} </SyntaxHighlighter> <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"> <CodeCopyButton code={codeString} /> </div> </div> ) : ( <code className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded-sm text-sm font-mono" {...props}> {children} </code> ); }, table: ({node, ...props}: any) => <div className="overflow-x-auto my-3"><table className="min-w-full divide-y divide-slate-300 border border-slate-300 text-sm" {...props} /></div>, thead: ({node, ...props}: any) => <thead className="bg-slate-100" {...props} />, th: ({node, ...props}: any) => <th className="px-3 py-2 text-left font-semibold text-slate-700" {...props} />, td: ({node, ...props}: any) => <td className="px-3 py-2 text-slate-600" {...props} />, };

// --- Main Component ---
export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('image');

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatApiError, setChatApiError] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[0].value);
  const [dailyChatCount, setDailyChatCount] = useState(0);
  const [dailyChatLimitReached, setDailyChatLimitReached] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageApiError, setImageApiError] = useState('');
  const [dailyImageCount, setDailyImageCount] = useState(0);
  const [dailyImageLimitReached, setDailyImageLimitReached] = useState(false);

  // Effect for daily limits management
  useEffect(() => {
    const currentDate = getCurrentDateString();

    // Chat limit
    const storedChatCountStr = localStorage.getItem(LOCAL_STORAGE_CHAT_COUNT_KEY);
    const storedChatDate = localStorage.getItem(LOCAL_STORAGE_CHAT_DATE_KEY);
    let currentDayChatCount = 0;
    if (storedChatDate === currentDate && storedChatCountStr) currentDayChatCount = parseInt(storedChatCountStr, 10);
    else {
      localStorage.setItem(LOCAL_STORAGE_CHAT_COUNT_KEY, '0');
      localStorage.setItem(LOCAL_STORAGE_CHAT_DATE_KEY, currentDate);
    }
    setDailyChatCount(currentDayChatCount);
    if (currentDayChatCount >= MAX_FREE_CHAT_RESPONSES) setDailyChatLimitReached(true);

    // Image limit
    const storedImageCountStr = localStorage.getItem(LOCAL_STORAGE_IMAGE_COUNT_KEY);
    const storedImageDate = localStorage.getItem(LOCAL_STORAGE_IMAGE_DATE_KEY);
    let currentDayImageCount = 0;
    if (storedImageDate === currentDate && storedImageCountStr) currentDayImageCount = parseInt(storedImageCountStr, 10);
    else {
      localStorage.setItem(LOCAL_STORAGE_IMAGE_COUNT_KEY, '0');
      localStorage.setItem(LOCAL_STORAGE_IMAGE_DATE_KEY, currentDate);
    }
    setDailyImageCount(currentDayImageCount);
    if (currentDayImageCount >= MAX_FREE_IMAGE_GENERATIONS) setDailyImageLimitReached(true);

  }, []);

  useEffect(() => {
    if (activeTab === 'chat' && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, activeTab]);

  const handleClearChatInput = () => setChatInput('');
  const handleClearChatHistory = () => { setChatHistory([]); setChatApiError(''); };

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading || dailyChatLimitReached) return;
    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: chatInput, type: 'text', timestamp: new Date() };
    setChatHistory(prev => [...prev, userMessage]);
    setChatInput(''); setChatLoading(true); setChatApiError('');
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: userMessage.text, model: selectedModel }) });
      if (!res.ok) { const errorData = await res.json(); throw new Error(errorData.error || `API Error: ${res.status}`); }
      const data = await res.json();
      if (data.text) {
        const aiMessage: ChatMessage = { id: Date.now().toString() + '_ai', sender: 'ai', text: data.text, type: 'text', timestamp: new Date() };
        setChatHistory(prev => [...prev, aiMessage]);
        const newCount = dailyChatCount + 1;
        setDailyChatCount(newCount);
        localStorage.setItem(LOCAL_STORAGE_CHAT_COUNT_KEY, newCount.toString());
        localStorage.setItem(LOCAL_STORAGE_CHAT_DATE_KEY, getCurrentDateString());
        if (newCount >= MAX_FREE_CHAT_RESPONSES) setDailyChatLimitReached(true);
      } else if (data.error) throw new Error(data.error);
      else throw new Error('Received an unexpected response from the AI.');
    } catch (err: any) {
      const errorMessage: ChatMessage = { id: Date.now().toString() + '_err', sender: 'system', text: err.message || '❌ Failed to contact AI.', type: 'text', timestamp: new Date() };
      setChatHistory(prev => [...prev, errorMessage]);
      setChatApiError(errorMessage.text);
    } finally { setChatLoading(false); }
  };

  const handleImageSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim() || imageLoading || dailyImageLimitReached) return;
    setImageLoading(true); setGeneratedImageUrl(null); setImageApiError('');
    try {
        const res = await fetch('/api/image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: imagePrompt }) });
        if (!res.ok) { const errorData = await res.json(); throw new Error(errorData.error || `Image API Error: ${res.status}`); }
        const data = await res.json();
        if (data.imageUrl) {
            setGeneratedImageUrl(data.imageUrl);
            const newCount = dailyImageCount + 1;
            setDailyImageCount(newCount);
            localStorage.setItem(LOCAL_STORAGE_IMAGE_COUNT_KEY, newCount.toString());
            localStorage.setItem(LOCAL_STORAGE_IMAGE_DATE_KEY, getCurrentDateString());
            if (newCount >= MAX_FREE_IMAGE_GENERATIONS) setDailyImageLimitReached(true);
        } else throw new Error('No image URL received from the server.');
    } catch (err: any) {
        console.error("Image generation error:", err);
        setImageApiError(err.message || '❌ Failed to generate image.');
    } finally { setImageLoading(false); }
  };

  const handleDownloadImage = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    // Create a filename, e.g., moodify-image-timestamp.png
    // Extracting extension might be tricky if mime type isn't always image/png
    const filename = `moodify-image-${Date.now()}.png`; // Assuming PNG for simplicity
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chatProgressPercentage = Math.min((dailyChatCount / MAX_FREE_CHAT_RESPONSES) * 100, 100);
  const imageProgressPercentage = Math.min((dailyImageCount / MAX_FREE_IMAGE_GENERATIONS) * 100, 100);

  const TabButton = ({ tabId, label, icon }: { tabId: ActiveTab; label: string; icon: ReactNode }) => (
    <button onClick={() => setActiveTab(tabId)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors duration-150 ${activeTab === tabId ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100' }`} > {icon} {label} </button>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 flex flex-col items-center p-4 sm:p-6 selection:bg-blue-200 selection:text-blue-900 font-sans">
      <div className="w-full max-w-3xl flex flex-col h-[calc(100vh-3rem)] sm:h-[calc(100vh-4rem)]">
        <header className="mb-1">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0 mb-3">
            <div className="flex items-center gap-2.5"> <SparkleIcon className="w-8 h-8 text-amber-500" /> <h1 className="text-3xl sm:text-4xl font-semibold text-slate-800"> moodify AI Studio </h1> </div>
            {activeTab === 'chat' && (
              <div className="flex items-center gap-3">
                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={chatLoading || dailyChatLimitReached} className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 shadow-sm disabled:opacity-70"> {AVAILABLE_MODELS.map(model => (<option key={model.value} value={model.value}>{model.label}</option>))} </select>
                <button onClick={handleClearChatHistory} title="Clear Chat History" className="p-2 text-slate-500 hover:text-red-600 transition-colors rounded-md hover:bg-slate-200 disabled:opacity-50" disabled={chatHistory.length === 0 && !chatApiError}> <TrashIcon className="w-6 h-6" /> </button>
              </div>
            )}
          </div>
          <div className="flex border-b border-slate-200"> <TabButton tabId="image" label="Image Generation" icon={<ImageIcon />} /> <TabButton tabId="chat" label="Chat with Gemini" icon={<ChatBubbleIcon />} /> </div>
        </header>

        <div className="flex-grow bg-white rounded-b-xl rounded-tr-xl shadow-lg overflow-hidden flex flex-col">
          {activeTab === 'image' && (
            <div className="flex-grow p-4 sm:p-6 flex flex-col">
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-600 mb-0.5"> <span>Daily Image Generations:</span> <span>{dailyImageCount}/{MAX_FREE_IMAGE_GENERATIONS}</span> </div>
                <div className="w-full bg-slate-200 rounded-full h-2"> <div className={`h-2 rounded-full transition-all duration-300 ease-out ${imageProgressPercentage >= 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${imageProgressPercentage}%` }} ></div> </div>
                {dailyImageLimitReached && (<p className="text-xs text-red-600 mt-1">Daily image generation limit reached.</p>)}
              </div>
              <form onSubmit={handleImageSubmit} className="mb-6">
                <label htmlFor="image-prompt-input" className="block text-sm font-medium text-slate-700 mb-1.5"> Describe the image you want to create: </label>
                <div className="flex gap-2">
                  <textarea id="image-prompt-input" className={`flex-grow p-3 border ${dailyImageLimitReached ? 'border-slate-300 bg-slate-100 cursor-not-allowed' : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm transition text-base text-slate-800 placeholder-slate-400 resize-y min-h-[60px]`} rows={2} value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} placeholder="e.g., A majestic lion with a starry mane" disabled={imageLoading || dailyImageLimitReached} />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-70 disabled:cursor-not-allowed self-end h-[60px]" disabled={imageLoading || !imagePrompt.trim() || dailyImageLimitReached} > {imageLoading ? ( <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ) : ( "Generate" )} </button>
                </div>
              </form>
              <div className="flex-grow flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300 p-2 relative min-h-[300px]">
                {imageLoading && <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10"><p className="text-slate-600 font-semibold text-lg">Generating your masterpiece...</p></div>}
                {imageApiError && <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded w-full text-center"><p className="font-medium">Error:</p><p className="text-sm">{imageApiError}</p></div>}
                {!imageLoading && generatedImageUrl && (
                  <div className="w-full flex flex-col items-center gap-4">
                    <img src={generatedImageUrl} alt={imagePrompt || "Generated image"} className="w-full h-auto max-h-[60vh] object-contain rounded-md shadow-md" />
                    <button onClick={handleDownloadImage} className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition flex items-center gap-2"> <DownloadIcon /> Download Image </button>
                  </div>
                )}
                {!imageLoading && !generatedImageUrl && !imageApiError && ( <p className="text-slate-400 text-center">Your generated image will appear here. <br/> Describe something amazing!</p> )}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex-grow flex flex-col overflow-hidden">
                 <div className="p-3 text-xs text-slate-600 border-b border-slate-200">
                    <p className="text-slate-600 text-center sm:text-left"> Ask anything using the selected Gemini model. Daily chat limit applies. </p>
                    <div className="mt-1.5">
                        <div className="flex justify-between text-xs text-slate-500 mb-0.5"> <span>Daily Chat Responses:</span> <span>{dailyChatCount}/{MAX_FREE_CHAT_RESPONSES}</span> </div>
                        <div className="w-full bg-slate-200 rounded-full h-2"> <div className={`h-2 rounded-full transition-all duration-300 ease-out ${chatProgressPercentage >= 100 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${chatProgressPercentage}%` }} ></div> </div>
                    </div>
                </div>
                <main ref={chatContainerRef} className="flex-grow p-4 sm:p-6 space-y-4 scroll-smooth overflow-y-auto">
                    {chatHistory.length === 0 && !chatLoading && ( <div className="text-center text-slate-400 py-10"> <SparkleIcon className="w-16 h-16 text-slate-300 mx-auto mb-2" /> No messages yet. <br/> Start a conversation! </div> )}
                    {chatHistory.map((msg) => ( <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}> <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${ msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : msg.sender === 'ai' ? 'bg-slate-50 text-slate-800 rounded-bl-none border border-slate-200' : 'bg-red-100 text-red-700 border border-red-300 w-full text-center' }`}> <div className="flex items-start gap-2"> {msg.sender === 'ai' && <BotIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />} {msg.sender === 'user' && <UserIcon className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" />} {msg.sender === 'ai' ? ( <div className="markdown-content w-full overflow-hidden"> <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]} children={msg.text} /> </div> ) : ( <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed break-words"> {msg.text} </p> )} </div> <p className={`text-xs mt-1.5 ${ msg.sender === 'user' ? 'text-blue-200 text-right' : msg.sender === 'ai' ? 'text-slate-500 text-left' : 'text-red-500 text-center' }`}> {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </p> </div> </div> ))}
                    {chatLoading && chatHistory.length > 0 && chatHistory[chatHistory.length -1].sender === 'user' && ( <div className="flex justify-start"> <div className="max-w-[85%] p-3 rounded-2xl shadow-sm bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200"> <div className="flex items-center gap-2"> <BotIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /> <div className="flex space-x-1"> <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div> <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div> <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div> </div> </div> </div> </div> )}
                </main>
                {dailyChatLimitReached && ( <div className="m-3 sm:m-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm text-sm"> <p className="font-medium">Daily Chat Limit Reached</p> <p>You've used all your {MAX_FREE_CHAT_RESPONSES} free chat responses for today. Please try again tomorrow.</p> </div> )}
                <form onSubmit={handleChatSubmit} className="bg-white p-3 sm:p-4 border-t border-slate-200 flex items-center gap-2 sm:gap-3">
                    <div className="relative flex-grow"> <textarea id="chat-input" className={`w-full p-3 pr-10 border ${dailyChatLimitReached ? 'border-slate-300 bg-slate-100 cursor-not-allowed' : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm transition text-base text-slate-800 placeholder-slate-400 resize-none no-scrollbar`} rows={1} style={{ maxHeight: '120px', overflowY: 'auto' }} value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSubmit(e as any); } }} placeholder={dailyChatLimitReached ? "Daily chat limit reached" : "Ask Gemini..."} disabled={chatLoading || dailyChatLimitReached} /> {chatInput && !chatLoading && !dailyChatLimitReached && ( <button type="button" onClick={handleClearChatInput} title="Clear input" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"> <XCircleIcon className="w-5 h-5" /> </button> )} </div>
                    <button type="submit" title="Send message" className="flex-shrink-0 bg-blue-600 text-white p-3 rounded-lg font-semibold text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-70 disabled:cursor-not-allowed" disabled={chatLoading || !chatInput.trim() || dailyChatLimitReached}> {chatLoading ? ( <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> ) : ( <SendIcon className="w-5 h-5" /> )} </button>
                </form>
            </div>
          )}
        </div>
        <footer className="mt-3 sm:mt-4 text-center"> <p className="text-xs text-slate-500"> Chat response limit resets daily. Image generation via Hugging Face. <br/> Build by <a href="https://sarmadgardezi.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">Sarmad Gardezi</a> </p> </footer>
      </div>
    </div>
  );
}