import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const ChatIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" />
    </svg>
);
const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const SendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

interface Message {
    text: string;
    sender: 'user' | 'ai';
}

const AIChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);
    
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ sender: 'ai', text: "Hi! I'm Campus Compass, your AI guide for SRMIST. How can I help you today?" }]);
        }
    }, [isOpen, messages.length]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = userInput.trim();
        if (!trimmedInput || isLoading) return;

        const newMessages: Message[] = [...messages, { text: trimmedInput, sender: 'user' }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    {
                        parts: [
                          { text: `System instruction: You are a friendly and helpful AI assistant for the SRMIST Potheri campus. Your name is 'Campus Compass'. Answer student questions about locations, facilities, events, and general campus life. Keep your answers concise and helpful. Use markdown for formatting if needed. User question: ${trimmedInput}` }
                        ]
                    }
                ]
            });

            setMessages([...newMessages, { text: response.text, sender: 'ai' }]);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setMessages([...newMessages, { text: "Sorry, I'm having trouble connecting right now. Please try again later.", sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-rose-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-all transform hover:scale-110"
                    aria-label="Open AI Chatbot"
                >
                    <ChatIcon />
                </button>
            </div>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col z-50 transform transition-all duration-300 ease-out origin-bottom-right scale-95 opacity-0 animate-fade-in-scale">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 bg-rose-400 text-white rounded-t-2xl">
                        <h3 className="font-bold text-lg">Campus Compass AI</h3>
                        <button onClick={() => setIsOpen(false)} aria-label="Close chat">
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div ref={chatBoxRef} className="flex-grow p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-rose-400 text-white rounded-br-none' : 'bg-lime-100 text-rose-900 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                               <div className="max-w-xs px-4 py-2 rounded-2xl bg-lime-100 text-rose-900 rounded-bl-none flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-rose-300 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-rose-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-rose-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <div className="p-4 border-t border-rose-200">
                        <form onSubmit={handleSendMessage} className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="Ask me anything..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className="w-full bg-lime-100 rounded-full py-3 px-5 pr-14 focus:outline-none focus:ring-2 focus:ring-rose-400 text-rose-800 placeholder-rose-400"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-400 hover:bg-rose-500 text-white w-10 h-10 rounded-full flex items-center justify-center disabled:bg-rose-300"
                                aria-label="Send Message"
                                disabled={isLoading}
                            >
                                <SendIcon />
                            </button>
                        </form>
                    </div>
                     <style>{`
                        @keyframes fade-in-scale {
                            from { transform: scale(0.95); opacity: 0; }
                            to { transform: scale(1); opacity: 1; }
                        }
                        .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out forwards; }
                    `}</style>
                </div>
            )}
        </>
    );
};

export default AIChatbot;
