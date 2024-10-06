// src/components/ShipCard.jsx
import React from 'react';

const ShipCard = ({ ship, onEdit, onDelete }) => (
  <div className="bg-gray-800 p-4 rounded-lg mb-4">
    <h3 className="text-xl font-bold text-white mb-2">{ship.name}</h3>
    <p className="text-gray-300">Type: {ship.type}</p>
    <p className="text-gray-300">Launch Year: {ship.launch_year}</p>
    <p className="text-gray-300">Country: {ship.country}</p>
    <p className="text-gray-300">Length: {ship.length}</p>
    <h4 className="text-lg font-semibold text-white mt-2">Notable Events:</h4>
    <ul className="list-disc list-inside text-gray-300">
      {ship.notable_events.map((event, index) => (
        <li key={index}>{event}</li>
      ))}
    </ul>
    <div className="mt-4">
      <button onClick={() => onEdit(ship)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Edit</button>
      <button onClick={() => onDelete(ship.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
    </div>
  </div>
);

export default ShipCard;