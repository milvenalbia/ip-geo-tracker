import { Trash2 } from 'lucide-react';

const SearchCard = ({
  toggleHistorySelection,
  searchHistory,
  selectedHistories,
  handleHistoryClick,
  handleDeleteSelected,
}) => {
  return (
    <div className='bg-white rounded-2xl shadow-lg p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold text-gray-800'>Search History</h2>
        {selectedHistories.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className='flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition'
          >
            <Trash2 className='w-4 h-4' />
            Delete ({selectedHistories.length})
          </button>
        )}
      </div>

      {searchHistory.length === 0 ? (
        <p className='text-gray-500 text-center py-8'>No search history yet</p>
      ) : (
        <div className='space-y-2 max-h-[600px] overflow-y-auto'>
          {searchHistory.map((item) => (
            <div
              key={item.id}
              className='flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition'
            >
              <input
                type='checkbox'
                checked={selectedHistories.includes(item.ip)}
                onChange={() => toggleHistorySelection(item.ip)}
                className='w-4 h-4 text-indigo-600 rounded'
              />
              <button
                onClick={() => handleHistoryClick(item)}
                className='flex-1 text-left'
              >
                <p className='font-semibold text-gray-800'>{item.ip}</p>
                <p className='text-sm text-gray-600'>
                  {item.city}, {item.country}
                </p>
                <p className='text-xs text-gray-400'>
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCard;
