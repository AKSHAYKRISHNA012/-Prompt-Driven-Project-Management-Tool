
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAppState } from '../context/AppContext';
import { USERS } from '../constants';
import { ColumnId } from '../types';

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981'];

const ProgressDashboard: React.FC = () => {
    const { state } = useAppState();
    const { project } = state;

    const taskStatusData = useMemo(() => {
        return project.columns.map(column => ({
            name: column.title,
            value: project.tasks.filter(task => task.status === column.id).length,
        })).filter(item => item.value > 0);
    }, [project.tasks, project.columns]);
    
    const tasksPerMemberData = useMemo(() => {
        const tasksByMember = USERS.map(user => {
            const userTasks = project.tasks.filter(task => task.assigneeId === user.id);
            return {
                name: user.name.split(' ')[0], // First name
                [ColumnId.ToDo]: userTasks.filter(t => t.status === ColumnId.ToDo).length,
                [ColumnId.InProgress]: userTasks.filter(t => t.status === ColumnId.InProgress).length,
                [ColumnId.InReview]: userTasks.filter(t => t.status === ColumnId.InReview).length,
                [ColumnId.Done]: userTasks.filter(t => t.status === ColumnId.Done).length,
            };
        });
        return tasksByMember;
    }, [project.tasks]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-white dark:bg-gray-800 p-2 border dark:border-gray-600 rounded shadow-lg">
              <p className="label font-bold">{`${label}`}</p>
              {payload.map((pld: any) => (
                <div key={pld.dataKey} style={{ color: pld.color }}>
                  {`${pld.name}: ${pld.value}`}
                </div>
              ))}
            </div>
          );
        }
        return null;
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Progress Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* Task Status Pie Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Task Status Overview</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={taskStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {taskStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tasks per Team Member Bar Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md xl:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Workload Distribution</h2>
                     <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={tasksPerMemberData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.2)"/>
                                <XAxis dataKey="name" stroke="currentColor" />
                                <YAxis stroke="currentColor" />
                                <Tooltip cursor={{fill: 'rgba(128, 128, 128, 0.1)'}} content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="todo" stackId="a" fill={COLORS[0]} name="To Do" />
                                <Bar dataKey="inprogress" stackId="a" fill={COLORS[1]} name="In Progress" />
                                <Bar dataKey="inreview" stackId="a" fill={COLORS[2]} name="In Review" />
                                <Bar dataKey="done" stackId="a" fill={COLORS[3]} name="Done" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProgressDashboard;
