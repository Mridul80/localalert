import React, { useState, useRef } from 'react';

// --- TYPES ---
interface User {
    name: string;
    avatarColor: string;
}

interface Message {
    id: number;
    user: User;
    text: string;
    image?: string;
    likes: number;
    isLiked: boolean;
}

interface Channel {
    id: string;
    name: string;
    description: string;
}

// --- MOCK DATA ---
const currentUser: User = { name: 'You', avatarColor: 'bg-orange-200' };

const channels: Channel[] = [
    { id: 'campus-feedback', name: '# campus-feedback', description: 'Post suggestions and upvote ideas you like!' },
    { id: 'event-ideas', name: '# event-ideas', description: 'Brainstorm and plan upcoming campus events.' },
    { id: 'study-groups', name: '# study-groups', description: 'Find partners for your courses.' },
    { id: 'lost-and-found', name: '# lost-and-found', description: 'Lost an item? Post here to find it.' },
    { id: 'general-discussion', name: '# general-discussion', description: 'Chat about anything campus-related.' },
];

const initialMessages: Record<string, Message[]> = {
    'campus-feedback': [
        { id: 1, user: { name: 'Sarah J.', avatarColor: 'bg-red-300' }, text: 'Could we get more water coolers in the Tech Park building? It gets really busy during the day.', likes: 12, isLiked: false },
        { id: 2, user: { name: 'Mike R.', avatarColor: 'bg-teal-300' }, text: "I'd love to see a 24/7 cafe open during exam season. Would be a lifesaver for late-night study sessions.", likes: 28, isLiked: false },
        { id: 3, user: currentUser, text: 'Great idea about the cafe, Mike! I completely agree.', likes: 1, isLiked: true },
    ],
    'event-ideas': [
        { id: 4, user: { name: 'Chloe T.', avatarColor: 'bg-purple-300' }, text: 'How about a retro movie night on the main lawn?', likes: 15, isLiked: false },
    ],
    'study-groups': [
         { id: 5, user: { name: 'Alex P.', avatarColor: 'bg-blue-300' }, text: 'Anyone in CS101 wanna form a study group for the final exam?', likes: 5, isLiked: false },
    ],
    'lost-and-found': [],
    'general-discussion': [],
};


// --- ICONS ---
const ThumbsUpIcon: React.FC<{ active?: boolean }> = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${active ? 'text-white' : 'text-rose-300'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.758a1 1 0 00.97-1.22l-1.396-4.887A1 1 0 0012.382 11H9V6.5a1.5 1.5 0 00-3 0v3.833z" />
    </svg>
);

const PaperClipIcon: React.FC = () => (
     <svg xmlns="http://www.w.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
);

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


// --- MAIN COMPONENT ---
const CommunityForum: React.FC = () => {
    const [activeChannelId, setActiveChannelId] = useState<string>('campus-feedback');
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeChannel = channels.find(c => c.id === activeChannelId)!;
    const channelMessages = messages[activeChannelId] || [];

    const handleLike = (messageId: number) => {
        setMessages(prevMessages => {
            const updatedMessages = prevMessages[activeChannelId].map(msg => {
                if (msg.id === messageId) {
                    return {
                        ...msg,
                        likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1,
                        isLiked: !msg.isLiked,
                    };
                }
                return msg;
            });
            return { ...prevMessages, [activeChannelId]: updatedMessages };
        });
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' && !imagePreview) return;

        const newMsg: Message = {
            id: Date.now(),
            user: currentUser,
            text: newMessage.trim(),
            image: imagePreview || undefined,
            likes: 0,
            isLiked: false,
        };

        setMessages(prev => ({
            ...prev,
            [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
        }));

        setNewMessage('');
        setImagePreview(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center mb-4">
                        <svg className="h-8 w-8 text-rose-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" />
                        </svg>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-rose-900">Community Hub</h2>
                    </div>
                    <p className="text-lg text-rose-600 max-w-2xl mx-auto">Share your ideas, post feedback, and discuss how to make our campus even better.</p>
                </div>

                <div className="max-w-4xl mx-auto bg-lime-100 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6 h-[700px]">
                    {/* Sidebar with channels */}
                    <div className="w-full md:w-1/3 bg-white rounded-xl p-4 flex flex-col">
                        <h3 className="font-bold text-lg mb-4 text-rose-900">Discussion Channels</h3>
                        <div className="space-y-2 overflow-y-auto text-rose-800">
                            {channels.map(channel => (
                                <button
                                    key={channel.id}
                                    onClick={() => setActiveChannelId(channel.id)}
                                    className={`w-full text-left p-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200 ${activeChannelId === channel.id ? 'bg-teal-100 text-teal-900' : 'hover:bg-lime-100'}`}
                                >
                                    {channel.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main chat window */}
                    <div className="w-full md:w-2/3 flex flex-col bg-white rounded-xl">
                        <div className="p-4 border-b border-rose-200">
                            <h3 className="font-bold text-xl text-rose-900">{activeChannel.name}</h3>
                            <p className="text-sm text-rose-600">{activeChannel.description}</p>
                        </div>
                        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                            {channelMessages.length > 0 ? channelMessages.map(msg => (
                                <div key={msg.id} className={`flex items-start gap-3 ${msg.user.name === 'You' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full ${msg.user.avatarColor} flex-shrink-0`}></div>
                                    <div className={`flex flex-col ${msg.user.name === 'You' ? 'items-end' : 'items-start'}`}>
                                        <p className="font-semibold text-rose-900">{msg.user.name}</p>
                                        <div className={`p-3 rounded-lg mt-1 group ${msg.user.name === 'You' ? 'bg-rose-400 text-white' : 'bg-lime-100'}`}>
                                            {msg.image && <img src={msg.image} alt="User upload" className="rounded-lg mb-2 max-h-48" />}
                                            <p className={`${msg.user.name === 'You' ? 'text-white' : 'text-rose-900'}`}>{msg.text}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button onClick={() => handleLike(msg.id)} className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                                                    <ThumbsUpIcon active={msg.user.name === 'You' ? true : msg.isLiked} /> 
                                                    {msg.likes}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-rose-500 pt-16">
                                    <p>No messages yet.</p>
                                    <p>Be the first to start the conversation!</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-rose-200">
                             {imagePreview && (
                                <div className="relative inline-block mb-2">
                                    <img src={imagePreview} alt="Preview" className="h-20 rounded-lg" />
                                    <button
                                        onClick={() => setImagePreview(null)}
                                        className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow"
                                        aria-label="Remove image"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            )}
                            <form onSubmit={handleSendMessage} className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Share your thoughts..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="w-full bg-lime-100 rounded-full py-3 px-5 pr-24 focus:outline-none focus:ring-2 focus:ring-rose-400 text-rose-800 placeholder-rose-400"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-rose-400 hover:text-rose-600 p-2 mr-1" aria-label="Attach image">
                                        <PaperClipIcon />
                                    </button>
                                    <button type="submit" className="bg-rose-400 hover:bg-rose-500 text-white w-10 h-10 rounded-full flex items-center justify-center" aria-label="Send Message">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunityForum;
