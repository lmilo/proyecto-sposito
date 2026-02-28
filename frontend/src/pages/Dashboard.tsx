import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import { Plus, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Ticket {
    id: number;
    title: string;
    status: string;
    created_at: string;
}

const Dashboard: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem('user_role');

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const response = await api.get('/tickets');
            // Dependiendo de tu back, puede ser response.data o response.data.data si usas paginación
            setTickets(Array.isArray(response.data) ? response.data : response.data.data);
        } catch (error) {
            console.error("Error cargando tickets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const getStatusStyle = (status: string) => {
        const styles: any = {
            open: 'bg-green-100 text-green-700',
            in_progress: 'bg-blue-100 text-blue-700',
            resolved: 'bg-gray-100 text-gray-700',
        };
        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Gestión de Tickets</h1>
                    <p className="text-gray-500">Visualiza y gestiona las solicitudes de soporte.</p>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={fetchTickets}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Refrescar (Caché Redis 60s)"
                    >
                        <RefreshCcw size={20} />
                    </button>
                    {role === 'customer' && (
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                            <Plus size={20} />
                            Nuevo Ticket
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Título</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">Cargando tickets...</td>
                            </tr>
                        ) : tickets.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">No hay tickets registrados.</td>
                            </tr>
                        ) : (
                            tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium">#{ticket.id}</td>
                                    <td className="px-6 py-4">{ticket.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(ticket.status)}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link to={`/tickets/${ticket.id}`} className="text-blue-600 hover:underline">Ver detalles</Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Dashboard;