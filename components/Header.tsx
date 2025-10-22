
import React, { useState, useEffect, useRef } from 'react';
import type { NotificationItem } from '../types';

const LogoIcon: React.FC = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
        <rect width="32" height="32" rx="8" fill="url(#paint0_linear_1_2)"/>
        <path d="M16 8L12 12V20H20V12L16 8Z" fill="white"/>
        <path d="M16 24C17.1046 24 18 23.1046 18 22C18 20.8954 17.1046 20 16 20C14.8954 20 14 20.8954 14 22C14 23.1046 14.8954 24 16 24Z" fill="#FFD3B5"/>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A8E6CE"/>
                <stop offset="1" stopColor="#FF8C94"/>
            </linearGradient>
        </defs>
    </svg>
);

const WeatherIcon: React.FC<{ condition: string }> = ({ condition }) => {
    const commonProps = {
        className: "h-5 w-5 text-rose-400",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
    };

    switch (condition.toLowerCase()) {
        case 'sunny':
            return (
                <svg {...commonProps} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" />
                </svg>
            );
        case 'cloudy':
            return (
                <svg {...commonProps} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12h1m8-9v1m8.4 5.6l.7.7M6.3 6.3l-.7-.7M21 12h-1M4 12H3m15.3 6.3l.7-.7M6.3 17.7l-.7.7M12 21v-1m-4-4a4 4 0 118 0M12 7a4 4 0 100 8" />
                </svg>
            );
        case 'rainy':
            return (
                <svg {...commonProps} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10a4 4 0 100-8h-1.26A8 8 0 104 16.25" />
                    <path d="M8 14v6m4-6v6m4-4v6" />
                </svg>
            );
        default:
            return (
                <svg className="animate-spin h-5 w-5 text-rose-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            );
    }
};

const NotificationTypeIcon: React.FC<{ type: 'alert' | 'event' | 'news' }> = ({ type }) => {
    const commonProps = {
        className: "h-6 w-6",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
    };
    switch(type) {
        case 'alert': return <svg {...commonProps} className="h-6 w-6 text-red-400"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        case 'event': return <svg {...commonProps} className="h-6 w-6 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
        case 'news': return <svg {...commonProps} className="h-6 w-6 text-green-400"><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h2m-4 3H5" /></svg>;
    }
};

interface ForecastDay {
    day: string;
    condition: string;
    high: number;
    low: number;
}

interface HeaderProps {
    user: { name: string; initials: string } | null;
    onProfileClick: () => void;
}

const mockNotifications: NotificationItem[] = [
    { id: 1, type: 'alert', title: 'Water supply maintenance in Tech Park tomorrow, 10 AM to 1 PM.', timestamp: '2 hours ago' },
    { id: 2, type: 'event', title: 'Registrations for Hackathon 6.0 are closing soon!', timestamp: '8 hours ago' },
    { id: 3, type: 'news', title: 'SRM Rover Team wins international competition.', timestamp: '1 day ago' },
];

const Header: React.FC<HeaderProps> = ({ user, onProfileClick }) => {
    const [weather, setWeather] = useState<{
        current: { temp: number; condition: string } | null;
        forecast: ForecastDay[];
    }>({ current: null, forecast: [] });
    const [isForecastOpen, setIsForecastOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const forecastRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const todayIndex = new Date().getDay();
            const conditions = ['Sunny', 'Cloudy', 'Rainy'];

            const mockForecast: ForecastDay[] = Array.from({ length: 3 }, (_, i) => {
                const dayIndex = (todayIndex + i) % 7;
                const high = 28 + Math.floor(Math.random() * 5);
                const low = 22 + Math.floor(Math.random() * 3);
                return {
                    day: i === 0 ? 'Today' : days[dayIndex],
                    condition: conditions[i % conditions.length],
                    high,
                    low,
                };
            });

            setWeather({
                current: {
                    temp: mockForecast[0].high,
                    condition: mockForecast[0].condition,
                },
                forecast: mockForecast,
            });
        }, 1500);

        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (forecastRef.current && !forecastRef.current.contains(event.target as Node)) {
                setIsForecastOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };

        if (isForecastOpen || isNotificationsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isForecastOpen, isNotificationsOpen]);


    return (
        <header className="bg-white py-3 px-4 sm:px-6 lg:px-8 shadow-sm sticky top-0 z-50">
             <style>{`
                @keyframes fade-in-down {
                    from {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.2s ease-out;
                    transform-origin: top right;
                }
            `}</style>
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <LogoIcon />
                    <div>
                        <h1 className="text-lg font-bold text-rose-900">LocalAlert Pro</h1>
                        <p className="text-xs text-rose-600">SRMIST Potheri • Smart Campus</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                     <div className="relative">
                        <button 
                            onClick={() => setIsForecastOpen(prev => !prev)}
                            className="flex items-center space-x-2 text-sm text-rose-700 w-36 justify-end p-2 rounded-lg hover:bg-lime-100 transition-colors"
                            aria-expanded={isForecastOpen}
                            aria-controls="weather-forecast-popup"
                        >
                            {weather.current === null ? (
                                <>
                                    <WeatherIcon condition="loading" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <WeatherIcon condition={weather.current.condition} />
                                    <span>{weather.current.temp}°C {weather.current.condition}</span>
                                </>
                            )}
                        </button>

                        {isForecastOpen && weather.forecast.length > 0 && (
                            <div
                                ref={forecastRef}
                                id="weather-forecast-popup"
                                className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-lime-200 p-4 z-10 animate-fade-in-down"
                                role="region"
                                aria-label="3-day weather forecast"
                            >
                                <h3 className="font-bold text-rose-900 mb-3 text-base">Potheri Forecast</h3>
                                <ul className="space-y-3">
                                    {weather.forecast.map((day, index) => (
                                        <li key={index} className="flex justify-between items-center text-sm">
                                            <span className="font-semibold text-rose-800 w-12">{day.day}</span>
                                            <WeatherIcon condition={day.condition} />
                                            <span className="text-rose-600">
                                                <span className="font-semibold text-rose-800">{day.high}°</span> / {day.low}°
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="relative" ref={notificationsRef}>
                        <button onClick={() => setIsNotificationsOpen(prev => !prev)} className="relative p-2 rounded-full hover:bg-lime-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute -top-0 -right-0 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-white text-xs items-center justify-center">{mockNotifications.length}</span>
                            </span>
                        </button>
                         {isNotificationsOpen && (
                            <div
                                className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-lime-200 z-10 animate-fade-in-down"
                                role="region"
                                aria-label="Notifications"
                            >
                                <div className="p-3 border-b border-lime-200">
                                    <h3 className="font-bold text-rose-900 text-base">Notifications</h3>
                                </div>
                                <ul className="max-h-80 overflow-y-auto">
                                    {mockNotifications.map(item => (
                                        <li key={item.id} className="border-b border-lime-100 last:border-b-0">
                                            <a href="#" className="flex items-start p-3 hover:bg-lime-50 transition-colors">
                                                <div className="flex-shrink-0 mt-1">
                                                    <NotificationTypeIcon type={item.type} />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-rose-800 leading-tight">{item.title}</p>
                                                    <p className="text-xs text-rose-500 mt-1">{item.timestamp}</p>
                                                </div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <div className="p-2 bg-lime-50 rounded-b-xl text-center">
                                    <a href="#" className="text-sm font-semibold text-rose-600 hover:underline">View all</a>
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={onProfileClick} className="relative" aria-label="Open user menu">
                        <div className="w-8 h-8 rounded-full bg-rose-400 text-white flex items-center justify-center font-bold text-sm">
                           {user ? user.initials : 'DB'}
                        </div>
                        {user && (
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-teal-300 ring-2 ring-white" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;