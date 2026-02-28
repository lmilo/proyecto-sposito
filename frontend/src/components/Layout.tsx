import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LogOut, Ticket, User as UserIcon, Sun, Moon } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = document.cookie
            .split('; ')
            .find(row => row.startsWith('user_theme='))
            ?.split('=')[1] as 'light' | 'dark';
        
        return savedTheme || 'light';
    });

    const userName = localStorage.getItem('user_name');
    const userRole = localStorage.getItem('user_role');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        try {
            await api.post('/preferences/theme', { theme: newTheme });
            
            setTheme(newTheme);
            
            document.cookie = `user_theme=${newTheme}; max-age=31536000; path=/`;
        } catch (error) {
            console.error("Error al guardar preferencia", error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 text-xl">
                            <Ticket size={28} />
                            <span>HelpDesk</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {/* BOTÓN DE TEMA */}
                            <button 
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-yellow-400" />}
                            </button>

                            <div className="flex items-center gap-2 text-sm border-r dark:border-gray-700 pr-4">
                                <UserIcon size={18} />
                                <div className="hidden sm:block">
                                    <p className="font-semibold leading-none">{userName}</p>
                                    <p className="text-xs capitalize text-gray-500">{userRole}</p>
                                </div>
                            </div>
                            
                            <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 flex items-center gap-1 text-sm">
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Salir</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;