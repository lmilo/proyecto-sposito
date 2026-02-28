import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import { MessageSquare, Send, ArrowLeft, Clock, CheckCircle } from 'lucide-react';

interface Comment {
    id: number;
    message: string;
    user: { name: string };
    created_at: string;
}

interface Ticket {
    id: number;
    title: string;
    description: string;
    status: string;
    comments: Comment[];
}

const TicketDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const role = localStorage.getItem('user_role');

    const fetchTicket = async () => {
        try {
            const response = await api.get(`/tickets/${id}`);
            setTicket(response.data);
        } catch (error) {
            console.error("No autorizado o no encontrado", error);
            navigate('/dashboard');
        }
    };

    useEffect(() => { fetchTicket(); }, [id]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            await api.post(`/tickets/${id}/comments`, { message: newMessage });
            setNewMessage('');
            fetchTicket(); // Recargar para ver el comentario (y disparar la cola en el back)
        } finally {
            setSending(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        try {
            await api.patch(`/tickets/${id}/status`, { status: newStatus });
            fetchTicket();
        } catch (error) { alert("Error al actualizar estado"); console.error(error); }
    };

    if (!ticket) return <Layout><p className="text-center py-10">Cargando...</p></Layout>;

    return (
        <Layout>
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors">
                <ArrowLeft size={18} /> Volver al listado
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Info del Ticket */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-xl shadow-sm border">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl font-bold text-gray-900">{ticket.title}</h1>
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-700">
                                {ticket.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">{ticket.description}</p>
                    </div>

                    {/* Sección de Comentarios */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MessageSquare size={20} /> Comentarios
                        </h3>
                        <div className="space-y-6 mb-8">
                            {ticket.comments?.map(c => (
                                <div key={c.id} className="border-l-4 border-blue-500 pl-4 py-1">
                                    <p className="text-gray-800">{c.message}</p>
                                    <p className="text-xs text-gray-400 mt-1 font-medium">Por: {c.user.name} • {new Date(c.created_at).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleAddComment} className="flex gap-2">
                            <input 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escribe un comentario..."
                                className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button disabled={sending} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Columna Derecha: Acciones de Agente */}
                <div className="space-y-6">
                    {role === 'agent' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Acciones del Agente</h4>
                            <div className="space-y-3">
                                <button onClick={() => updateStatus('in_progress')} className="w-full flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                                    <Clock size={18} /> En Progreso
                                </button>
                                <button onClick={() => updateStatus('resolved')} className="w-full flex items-center justify-center gap-2 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors">
                                    <CheckCircle size={18} /> Marcar Resuelto
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default TicketDetail;