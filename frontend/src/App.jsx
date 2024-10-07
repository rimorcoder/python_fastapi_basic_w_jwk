import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Alert, AlertDescription } from './components/ui/alert';
import ShipCard from './components/ShipCard';
import ShipForm from './components/ShipForm';
import { useDescope, useSession, useUser } from '@descope/react-sdk'
import { Descope } from '@descope/react-sdk'
import { getSessionToken } from '@descope/react-sdk';
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [ships, setShips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingShip, setEditingShip] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated, isSessionLoading } = useSession()
  const { user, isUserLoading } = useUser()
  const { logout } = useDescope()
  
  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  // Generate a UUID
  const uuid = uuidv4();


  useEffect(() => {
    const fetchShips = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/ships`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${getSessionToken()}`
          }
        }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch ships');
        }
        const data = await response.json();
        setShips(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShips();
  }, []);

  const handleSubmit = async (shipData) => {
    try {
      if (editingShip) {
        // update
        const response = await fetch(`${apiUrl}/ships/${editingShip.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${getSessionToken()}`
          },
          body: JSON.stringify(shipData),
        });
        if (!response.ok) {
          throw new Error('Failed to update ship');
        }
        const updatedShip = await response.json();
        setShips(ships.map(ship => ship.id === editingShip.id ? updatedShip : ship));
        showNotification('Ship updated successfully');
      } else {
        // create
        const shipDataWithUUID = {
          ...shipData,
          id: uuid,
        };

        const response = await fetch(`${apiUrl}/ships`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${getSessionToken()}`
          },
          body: JSON.stringify(shipDataWithUUID),
        });
        if (!response.ok) {
          throw new Error('Failed to create ship');
        }
        const newShip = await response.json();
        setShips([...ships, newShip]);
        showNotification('Ship created successfully');
      }
    } catch (error) {
      showNotification(`Error: ${error.message}`);
    }
    setEditingShip(null);
    setIsCreating(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/ships/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getSessionToken()}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete ship');
      }
      setShips(ships.filter(ship => ship.id !== id));
      showNotification('Ship deleted successfully');
    } catch (error) {
      showNotification(`Error: ${error.message}`);
    }
  };

  const filteredShips = ships.filter(ship =>
    ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ship.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ship.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (ship) => {
    setEditingShip(ship);
    setIsCreating(false);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  
  const sessionToken = getSessionToken()
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="mb-4 flex  justify-center items-center">
          <Descope
            flowId="sign-up-or-in"
            theme="dark"
            onSuccess={(e) => console.log(e.detail.user)}
            onError={(e) => console.log('Could not log in!')}
            redirectAfterSuccess="/"
          />
        </div>
      </div>
    )
  }

  if (isSessionLoading || isUserLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="bg-gray-800 mb-4 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="./ship.png" alt="Logo" className="h-12 w-12 rounded-full border-2 border-blue-500" />
            <h1 className="text-3xl font-bold tracking-tight">Ships</h1>
          </div>
          <div className="flex items-center space-x-6">
            <p className="text-lg hidden sm:inline">
              Welcome, <span className="font-semibold">{user.name.charAt(0).toUpperCase() + user.name.slice(1)}</span>
            </p>
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center space-x-2"
            >

              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mb-4 flex">
        <div className="relative flex-grow mr-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ships..."
            className="w-full p-2 pl-10 bg-gray-800 text-white rounded"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <button
          onClick={() => { setIsCreating(true); setEditingShip(null); }}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Ship
        </button>
      </div>
      {notification && (
        <Alert className="mb-4 bg-green-500 text-white">
          <AlertDescription>{notification}</AlertDescription>
        </Alert>
      )}
      {(editingShip || isCreating) && (
        <ShipForm
          ship={editingShip}
          onSubmit={handleSubmit}
          onCancel={() => { setEditingShip(null); setIsCreating(false); }}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShips.map(ship => (
          <ShipCard
            key={ship.id}
            ship={ship}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default App;