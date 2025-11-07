import { MapPin } from 'lucide-react';

const Map = ({ currentGeo }) => {
  return (
    <div className='bg-white rounded-2xl shadow-lg p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold text-gray-800'>Location Map</h2>
        <a
          href={`https://www.google.com/maps?q=${currentGeo.loc}`}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm'
        >
          <MapPin className='w-4 h-4' />
          Open in Google Maps
        </a>
      </div>
      <div className='w-full h-96 rounded-lg overflow-hidden border border-gray-200'>
        <iframe
          width='100%'
          height='100%'
          frameBorder='0'
          style={{ border: 0 }}
          src={`https://maps.google.com/maps?q=${currentGeo.loc}&output=embed`}
          allowFullScreen
          loading='lazy'
        ></iframe>
      </div>
    </div>
  );
};

export default Map;
