'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/useSocket';
import { ArrowLeft, Users, Calendar, Settings } from 'lucide-react';
import Link from 'next/link';
import TaskBoard from '@/commponent/TaskBoard';
import { Project } from '@/types';

export default function ProjectDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const [project, setProject] = useState<Project>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
    
    if (socket) {
      socket.emit('join:project', params.id);
      
      socket.on('task:updated', (updatedTask) => {
        console.log('Task updated:', updatedTask);
      });
    }

    return () => {
      if (socket) {
        socket.emit('leave:project', params.id);
      }
    };
  }, [params.id, socket]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/projects"
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {project?.name || 'Project'}
                </h1>
                <p className="text-gray-600">
                  {project?.description || 'No description'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{project?.memberCount || 0} members</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Due: {project?.endDate ?? 'No deadline'}</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Live updates active' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>

      <TaskBoard projectId={params.id} />
    </div>
  );
}