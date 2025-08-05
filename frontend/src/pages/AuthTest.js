import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../config/api';

const AuthTest = () => {
  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('test123');
  const [firstName, setFirstName] = useState('Test');
  const [lastName, setLastName] = useState('User');
  const [logs, setLogs] = useState([]);

  const { signup, login, isLoading, error, user, isAuthenticated } = useAuthStore();

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testSignup = async () => {
    addLog('Starting signup test...');
    try {
      await signup(email, password, firstName, lastName);
      addLog('Signup successful!');
    } catch (err) {
      addLog(`Signup failed: ${err.message}`);
    }
  };

  const testLogin = async () => {
    addLog('Starting login test...');
    try {
      await login(email, password);
      addLog('Login successful!');
    } catch (err) {
      addLog(`Login failed: ${err.message}`);
    }
  };

  const testDirectAPI = async () => {
    addLog('Testing direct API call...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      addLog(`Direct API Response: ${JSON.stringify(data)}`);
    } catch (err) {
      addLog(`Direct API Error: ${err.message}`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Configuration</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>API Base URL:</strong> {API_BASE_URL}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>Current User:</strong> {user ? JSON.stringify(user) : 'None'}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
          </div>

          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={testSignup}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Test Signup
            </button>
            <button
              onClick={testLogin}
              disabled={isLoading}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Test Login
            </button>
            <button
              onClick={testDirectAPI}
              disabled={isLoading}
              className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Test Direct API
            </button>
            <button
              onClick={() => setLogs([])}
              className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Clear Logs
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-black text-green-400 p-4 rounded h-96 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;