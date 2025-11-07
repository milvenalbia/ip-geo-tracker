import React from 'react';

const GeoCard = ({ label, currentGeo, color }) => {
  return (
    <div className={`bg-${color}-50 p-4 rounded-lg`}>
      <p className={`text-sm text-${color}-600 font-medium mb-1`}>{label}</p>
      <p className='text-lg font-bold text-gray-800'>{currentGeo || 'N/A'}</p>
    </div>
  );
};

export default GeoCard;
