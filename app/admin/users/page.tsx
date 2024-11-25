'use client';

import { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'store' | 'user') => {
    try {
      const response = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newRole }),
      });

      const data = await response.json();
      if (response.ok) {
        // Refresh the users list
        fetchUsers();
      } else {
        setError(data.error || 'Failed to update user role');
      }
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user._id} className="p-4 border rounded-lg flex items-center justify-between">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-600">Current Role: {user.role}</p>
            </div>
            <div className="flex gap-2">
              <Button
                color="primary"
                size="sm"
                onClick={() => updateUserRole(user._id, 'admin')}
                disabled={user.role === 'admin'}
              >
                Make Admin
              </Button>
              <Button
                color="secondary"
                size="sm"
                onClick={() => updateUserRole(user._id, 'store')}
                disabled={user.role === 'store'}
              >
                Make Store
              </Button>
              <Button
                color="default"
                size="sm"
                onClick={() => updateUserRole(user._id, 'user')}
                disabled={user.role === 'user'}
              >
                Make User
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
