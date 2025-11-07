import { useEffect, useState } from 'react';
import { Globe, LogOut, MapPin, Search, Trash2, Wifi, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import api from '../../api/axios';
import SearchCard from '../../components/SearchCard';
import Map from '../../components/Map';
import GeoCard from '../../components/GeoCard';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // IP Geolocation states
  const [currentGeo, setCurrentGeo] = useState(null);
  const [ipInput, setIpInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedHistories, setSelectedHistories] = useState([]);
  const [geoLoading, setGeoLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
      fetchUserGeo();
      fetchSearchHistory();
    }
    setLoading(false);
  }, []);

  // Fetch search history from database
  const fetchSearchHistory = async () => {
    try {
      const response = await api.get('/api/search-history');
      setSearchHistory(response.data);
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  // Fetch user's own geolocation
  const fetchUserGeo = async () => {
    setGeoLoading(true);
    try {
      const response = await fetch('https://ipinfo.io/geo');
      const data = await response.json();
      setCurrentGeo(data);
    } catch (error) {
      console.error('Error fetching geolocation:', error);
    } finally {
      setGeoLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      setCurrentGeo(null);
      setSearchHistory([]);
      navigate('/');
      toast.success('You have been logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  // Validate IP address
  const isValidIP = (ip) => {
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(ip)) return false;

    const parts = ip.split('.');
    return parts.every((part) => parseInt(part) >= 0 && parseInt(part) <= 255);
  };

  // Search IP geolocation
  const handleSearchIP = async (e) => {
    e.preventDefault();
    setSearchError('');

    if (!ipInput.trim()) {
      setSearchError('Please enter an IP address');
      return;
    }

    if (!isValidIP(ipInput)) {
      setSearchError('Please enter a valid IP address');
      return;
    }

    setGeoLoading(true);
    try {
      const response = await fetch(`https://ipinfo.io/${ipInput}/geo`);
      const data = await response.json();

      if (data.error) {
        throw new Error('Invalid IP address or unable to fetch data');
      }

      setCurrentGeo(data);

      // Save to database
      await api.post('/api/search-history', {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country,
        loc: data.loc,
        org: data.org,
        postal: data.postal,
        timezone: data.timezone,
      });

      // Refresh history
      fetchSearchHistory();
      toast.success('Location found and saved to history!');
    } catch (error) {
      setSearchError('Unable to fetch geolocation for this IP address');
      toast.error('Failed to fetch location data');
    } finally {
      setGeoLoading(false);
    }
  };

  // Clear search and revert to user's IP
  const handleClearSearch = () => {
    setIpInput('');
    setSearchError('');
    fetchUserGeo();
  };

  // Load history item
  const handleHistoryClick = (historyItem) => {
    setCurrentGeo(historyItem);
    setIpInput(historyItem.ip);
  };

  // Toggle history selection
  const toggleHistorySelection = (ip) => {
    setSelectedHistories((prev) =>
      prev.includes(ip) ? prev.filter((item) => item !== ip) : [...prev, ip]
    );
  };

  // Delete selected histories
  const handleDeleteSelected = async () => {
    try {
      await api.delete('/api/search-history', {
        data: { ips: selectedHistories },
      });
      setSearchHistory((prev) =>
        prev.filter((item) => !selectedHistories.includes(item.ip))
      );
      setSelectedHistories([]);
      setIpInput('');
      setSearchError('');
      fetchUserGeo();
      toast.success('History deleted successfully!');
    } catch (error) {
      console.error('Error deleting history:', error);
      toast.error('Failed to delete history');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // Home Screen
  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100'>
      {/* Header */}
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='bg-indigo-100 p-2 rounded-lg'>
              <Wifi className='w-6 h-6 text-indigo-600' />
            </div>
            <div>
              <h1 className='text-xl font-bold text-gray-800'>
                IP Geolocation Tracker
              </h1>
              <p className='text-sm text-gray-600'>Welcome, {user?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition'
          >
            <LogOut className='w-4 h-4' />
            Logout
          </button>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Geolocation Info Card */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='bg-white rounded-2xl shadow-lg p-6'>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                Current Location Info
              </h2>

              {/* Search Form */}
              <form onSubmit={handleSearchIP} className='mb-6'>
                <div className='flex flex-col sm:flex-row gap-2'>
                  <input
                    type='text'
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    placeholder='Enter IP address (e.g., 8.8.8.8)'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none'
                  />

                  <div className='flex gap-2'>
                    <button
                      type='submit'
                      disabled={geoLoading}
                      className='flex-1 sm:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2'
                    >
                      <Search className='w-4 h-4' />
                      <span className='hidden sm:inline'>Search</span>
                    </button>

                    {ipInput && (
                      <button
                        type='button'
                        onClick={handleClearSearch}
                        className='flex-1 sm:flex-none px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition flex items-center justify-center'
                      >
                        <X className='w-4 h-4' />
                        <span className='hidden sm:inline'>Clear</span>
                      </button>
                    )}
                  </div>
                </div>

                {searchError && (
                  <p className='text-red-600 text-sm mt-2'>{searchError}</p>
                )}
              </form>

              {/* Geolocation Data */}
              {geoLoading ? (
                <div className='text-center py-12'>
                  <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto'></div>
                  <p className='mt-4 text-gray-600'>Loading location data...</p>
                </div>
              ) : currentGeo ? (
                <div className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <GeoCard
                      label={'IP Address'}
                      currentGeo={currentGeo.ip}
                      color={'indigo'}
                    />
                    <GeoCard
                      label={'City'}
                      currentGeo={currentGeo.city}
                      color={'green'}
                    />
                    <GeoCard
                      label={'Region'}
                      currentGeo={currentGeo.region}
                      color={'blue'}
                    />
                    <GeoCard
                      label={'Country'}
                      currentGeo={currentGeo.country}
                      color={'purple'}
                    />
                    <GeoCard
                      label={'Coordinates'}
                      currentGeo={currentGeo.loc}
                      color={'orange'}
                    />
                    <GeoCard
                      label={'Organization'}
                      currentGeo={currentGeo.org}
                      color={'pink'}
                    />
                    <GeoCard
                      label={'Postal Code'}
                      currentGeo={currentGeo.postal}
                      color={'yellow'}
                    />
                    <GeoCard
                      label={'Timezone'}
                      currentGeo={currentGeo.timezone}
                      color={'teal'}
                    />
                  </div>
                </div>
              ) : (
                <div className='text-center py-12 text-gray-500'>
                  <Globe className='w-16 h-16 mx-auto mb-4 opacity-50' />
                  <p>No location data available</p>
                </div>
              )}
            </div>

            {/* Embedded Map */}
            {currentGeo?.loc && <Map currentGeo={currentGeo} />}
          </div>

          {/* Search History Card */}
          <SearchCard
            toggleHistorySelection={toggleHistorySelection}
            searchHistory={searchHistory}
            selectedHistories={selectedHistories}
            handleHistoryClick={handleHistoryClick}
            handleDeleteSelected={handleDeleteSelected}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
