import React, { useState, useEffect } from 'react';
import { XCircle, Search, Plus } from 'lucide-react';
import { Alert, AlertDescription } from './components/ui/alert';
import ShipCard from './components/ShipCard';
import ShipForm from './components/ShipForm';

const initialShips = [
  {
    "id":"b51f0b7c-c295-4d3a-b258-ec343f62befc",
    "name": "HMS Victory",
    "type": "First-rate ship of the line",
    "launch_year": 1765,
    "country": "United Kingdom",
    "length": "69.3 meters",
    "notable_events": [
      "Served as Admiral Nelson's flagship at the Battle of Trafalgar in 1805",
      "Currently preserved as a museum ship in Portsmouth"
    ]
  },
  {
    "id":"b51f0b7c-c295-3d3a-b258-ec343f63befc",
    "name": "USS Constitution",
    "type": "Frigate",
    "launch_year": 1797,
    "country": "United States",
    "length": "62.3 meters",
    "notable_events": [
      "Famous for defeating HMS Guerriere during the War of 1812",
      "Still commissioned and used for educational purposes"
    ]
  },
  {
    "id":"e51f0b7c-c295-4d3a-b258-ec343f63befc",
    "name": "Cutty Sark",
    "type": "Clipper ship",
    "launch_year": 1869,
    "country": "United Kingdom",
    "length": "65.2 meters",
    "notable_events": [
      "One of the last tea clippers built",
      "Currently a museum ship in Greenwich"
    ]
  },
  {
    "id":"b51f0b7c-c295-4d3a-b258-ex343f63befc",
    "name": "Bounty",
    "type": "Bark",
    "launch_year": 1784,
    "country": "United Kingdom",
    "length": "27 meters",
    "notable_events": [
      "Famous for the mutiny led by Fletcher Christian in 1789",
      "Reproduced for the 1962 film 'Mutiny on the Bounty'"
    ]
  },
  {
    "id":"b51f0b7c-c295-4d3a-b253-ec343f63befc",
    "name": "Santa Maria",
    "type": "Carrack",
    "launch_year": 1492,
    "country": "Spain",
    "length": "23 meters",
    "notable_events": [
      "Christopher Columbus's flagship during his first voyage to the Americas",
      "Sank off the coast of Hispaniola in 1492"
    ]
  },
  {
    "id":"a51f0b7c-c295-4d3a-b258-ec343f63befc",
    "name": "Golden Hind",
    "type": "Galleon",
    "launch_year": 1577,
    "country": "England",
    "length": "30 meters",
    "notable_events": [
      "Circumnavigated the globe under Sir Francis Drake",
      "Captured Spanish treasure ships"
    ]
  },
  {
    "id":"b51f0b7c-b295-4d3a-b258-ec343f63befc",
    "name": "Vasa",
    "type": "Warship",
    "launch_year": 1628,
    "country": "Sweden",
    "length": "69 meters",
    "notable_events": [
      "Sank on her maiden voyage",
      "Recovered and restored, now a museum ship in Stockholm"
    ]
  },
  {
    "id":"b51f0b7c-c295-4d3a-a258-ec343f63befc",
    "name": "Endeavour",
    "type": "Bark",
    "launch_year": 1764,
    "country": "United Kingdom",
    "length": "32 meters",
    "notable_events": [
      "Used by Captain James Cook on his first voyage of discovery",
      "Mapped New Zealand and the eastern coast of Australia"
    ]
  },
  {
    "id":"b51f0b7c-c295-4d3a-b258-ec343f63beac",
    "name": "Albatross",
    "type": "Clipper ship",
    "launch_year": 1854,
    "country": "United States",
    "length": "56 meters",
    "notable_events": [
      "Famous for its speed in the tea trade",
      "One of the last clipper ships built"
    ]
  },
  {
    "id":"b51f0b7c-c295-4d3a-b258-ec343f63befb",
    "name": "Richelieu",
    "type": "Frigate",
    "launch_year": 1892,
    "country": "France",
    "length": "96.5 meters",
    "notable_events": [
      "Participated in both World Wars",
      "Preserved as a museum ship in Brest"
    ]
  },
  {
    "id":"b51f0b7c-c295-4d3a-b258-ec343f63befc",
    "name": "Mayflower",
    "type": "Galleon",
    "launch_year": 1620,
    "country": "England",
    "length": "27 meters",
    "notable_events": [
      "Carried the Pilgrims to America",
      "Symbol of American history"
    ]
  }
];

const App = () => {
  const [ships, setShips] = useState(initialShips);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingShip, setEditingShip] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch the ships data from an API here
  }, []);

  const filteredShips = ships.filter(ship =>
    ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ship.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ship.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (ship) => {
    setEditingShip(ship);
    setIsCreating(false);
  };

  const handleDelete = (id) => {
    setShips(ships.filter(ship => ship.id !== id));
    showNotification('Ship deleted successfully');
  };

  const handleSubmit = (shipData) => {
    if (editingShip) {
      setShips(ships.map(ship => ship.id === editingShip.id ? { ...ship, ...shipData } : ship));
      showNotification('Ship updated successfully');
    } else {
      const newShip = { ...shipData, id: Date.now().toString() };
      setShips([...ships, newShip]);
      showNotification('Ship created successfully');
    }
    setEditingShip(null);
    setIsCreating(false);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="flex items-center mb-6">
        <img src="./ship.png" alt="Logo" className="h-16 w-16 mr-2 self-center" />
        <h1 className="text-3xl font-bold ">Ships</h1>
    </div>
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