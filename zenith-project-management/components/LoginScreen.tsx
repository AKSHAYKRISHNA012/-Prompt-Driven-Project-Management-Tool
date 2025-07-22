
import React from 'react';
import { useAppState } from '../context/AppContext';
import { USERS } from '../constants';
import { User, Role } from '../types';

const RoleCard: React.FC<{ user: User; onSelect: (user: User) => void }> = ({ user, onSelect }) => {
    const getRoleColors = (role: Role) => {
        switch (role) {
            case Role.Admin:
                return 'border-red-500 hover:bg-red-50 dark:hover:bg-red-900/50';
            case Role.Manager:
                return 'border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50';
            case Role.TeamMember:
                return 'border-green-500 hover:bg-green-50 dark:hover:bg-green-900/50';
            default:
                return 'border-gray-300 dark:border-gray-600';
        }
    };
    return (
        <div 
            onClick={() => onSelect(user)}
            className={`cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-2 transition-all duration-200 ${getRoleColors(user.role)}`}
        >
            <div className="flex items-center space-x-4">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full"/>
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{user.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{user.role}</p>
                </div>
            </div>
        </div>
    );
};


const LoginScreen: React.FC = () => {
  const { dispatch } = useAppState();

  const handleLogin = (user: User) => {
    dispatch({ type: 'LOGIN', payload: user });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">Welcome to Zenith</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Select a role to start managing your projects.</p>
      </div>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {USERS.map(user => (
          <RoleCard key={user.id} user={user} onSelect={handleLogin} />
        ))}
      </div>
    </div>
  );
};

export default LoginScreen;
