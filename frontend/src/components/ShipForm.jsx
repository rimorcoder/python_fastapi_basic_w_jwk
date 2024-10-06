// src/components/ShipCard.jsx
import React, { useState } from 'react';
import { XCircle, Plus } from 'lucide-react';

const ShipForm = ({ ship, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(ship || {
      name: '',
      type: '',
      launch_year: '',
      country: '',
      length: '',
      notable_events: ['']
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleEventChange = (index, value) => {
      const newEvents = [...formData.notable_events];
      newEvents[index] = value;
      setFormData(prev => ({ ...prev, notable_events: newEvents }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };
  
    return (
      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ship Name"
          className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
        />
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="Ship Type"
          className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
        />
        <input
          type="number"
          name="launch_year"
          value={formData.launch_year}
          onChange={handleChange}
          placeholder="Launch Year"
          className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
        />
        <input
          type="text"
          name="length"
          value={formData.length}
          onChange={handleChange}
          placeholder="Length"
          className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
        />
        <h4 className="text-white mb-2">Notable Events:</h4>
        {formData.notable_events.map((event, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={event}
              onChange={(e) => handleEventChange(index, e.target.value)}
              placeholder={`Event ${index + 1}`}
              className="flex-grow p-2 mr-2 bg-gray-700 text-white rounded"
            />
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                notable_events: prev.notable_events.filter((_, i) => i !== index)
              }))}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              <XCircle size={20} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFormData(prev => ({
            ...prev,
            notable_events: [...prev.notable_events, '']
          }))}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Event
        </button>
        <div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            {ship ? 'Update' : 'Create'} Ship
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    );
  };

export default ShipForm;