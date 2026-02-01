/* eslint-disable react/no-unescaped-entities */
import ProjectList from '@/commponent/ProjectList';
import { CheckSquare, Clock, Users, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      icon: CheckSquare,
      label: 'Active Projects',
      value: '24',
      change: '+12%',
      color: 'blue',
    },
    {
      icon: Clock,
      label: 'Pending Tasks',
      value: '156',
      change: '+8%',
      color: 'purple',
    },
    {
      icon: Users,
      label: 'Team Members',
      value: '42',
      change: '+3',
      color: 'green',
    },
    {
      icon: AlertCircle,
      label: 'Overdue Tasks',
      value: '8',
      change: '+2',
      color: 'amber',
      isNegative: true,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span
                  className={`${
                    stat.isNegative ? 'text-red-600' : 'text-green-600'
                  } text-sm font-semibold`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <ProjectList />
    </div>
  );
}