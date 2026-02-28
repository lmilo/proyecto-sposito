import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2 } from 'lucide-react';

// Definimos la interfaz aquí mismo para que sea rápido, 
// o puedes importarla si ya creaste el archivo de tipos.
interface LoginResponse {
    access_token: string;
    user: {
        name: string;
        role: string;
    };
}

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Especificamos que la respuesta tiene la forma de LoginResponse
            const response = await api.post<LoginResponse>('auth/login', { email, password });
            
            // Guardamos la info necesaria en el storage
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user_role', response.data.user.role);
            localStorage.setItem('user_name', response.data.user.name);

            // Redirigir al Dashboard
            navigate('/dashboard');
        } catch (err: unknown) {
            setError('Credenciales incorrectas. Intenta de nuevo.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        HelpDesk Support
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ingresa a tu panel de control
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-200">
                            {error}
                        </div>
                    )}
                    
                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;