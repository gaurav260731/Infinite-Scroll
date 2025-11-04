import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, User, Calendar, MapPin } from 'lucide-react';

const InfiniteScrollApp = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Simulate API call to fetch data
  const fetchData = useCallback(async (pageNum) => {
    setLoading(true);
    
    // Wait for 4 seconds to display data (better user awareness)
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Generate mock data - exactly 10 items per page
    const itemsPerPage = 10;
    const startId = (pageNum - 1) * itemsPerPage + 1;
    
    const newItems = Array.from({ length: itemsPerPage }, (_, index) => {
      const userId = startId + index;
      return {
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        location: ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Berlin', 'Toronto', 'Mumbai'][Math.floor(Math.random() * 8)],
        pageNumber: pageNum,
        batchNumber: `Batch ${pageNum}`
      };
    });
    
    // Simulate end of data after 5 pages
    if (pageNum >= 5) {
      setHasMore(false);
    }
    
    setItems(prev => [...prev, ...newItems]);
    setLoading(false);
  }, []);

  // Load initial data
  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 800 && // Load when 800px from bottom
        !loading && 
        hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  // Load more data when page changes
  useEffect(() => {
    if (page > 1) {
      fetchData(page);
    }
  }, [page, fetchData]);

  // Manual load more button (alternative to scroll)
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Infinite Scroll Demo</h1>
          <p className="text-gray-600 mt-2">
            Scroll down to load more users - each load takes 4 seconds with animated loader
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{items.length}</div>
              <div className="text-gray-600">Total Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{page} × 10</div>
              <div className="text-gray-600">Items Pattern</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{hasMore ? 'Yes' : 'No'}</div>
              <div className="text-gray-600">More Data Available</div>
            </div>
          </div>
        </div>

        {/* User Grid with batch indicators */}
        <div className="space-y-8">
          {/* Group items by batch/page for visual separation */}
          {Array.from({ length: page }, (_, batchIndex) => {
            const batchNumber = batchIndex + 1;
            const batchItems = items.filter(item => item.pageNumber === batchNumber);
            
            return (
              <div key={`batch-${batchNumber}`} className="space-y-4">
                {/* Batch Header */}
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {batchNumber}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Data Batch {batchNumber}</h3>
                      <p className="text-sm text-gray-600">Users {(batchNumber - 1) * 10 + 1} - {batchNumber * 10}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {batchItems.length} items loaded
                  </div>
                </div>
                
                {/* Batch Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {batchItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                          ID: {item.id}
                        </span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {item.batchNumber}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-gray-600 text-sm">{item.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {item.joinDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Loading indicator with 4-second display */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="bg-white rounded-xl shadow-2xl p-10 max-w-md mx-auto border">
              <div className="flex flex-col items-center space-y-6">
                {/* Main spinner */}
                <div className="relative">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                  <div className="absolute inset-0 w-12 h-12 border-2 border-blue-200 rounded-full animate-ping"></div>
                </div>
                
                {/* Loading text */}
                <div className="text-center space-y-2">
                  <div className="text-xl font-bold text-gray-800">Loading New Data</div>
                  <div className="text-sm text-gray-600">Fetching more users from server...</div>
                  <div className="text-xs text-gray-500">This may take a few seconds</div>
                </div>
                
                {/* Animated progress bar */}
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Progress</span>
                    <span>Loading...</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full animate-pulse shadow-sm"></div>
                  </div>
                </div>
                
                {/* Loading dots animation */}
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Load More Button (alternative to infinite scroll) */}
        {!loading && hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              Load More Users
            </button>
          </div>
        )}

        {/* End of data message */}
        {!hasMore && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Users Loaded</h3>
              <p className="text-gray-600">
                You've reached the end of our user database. No more data to load.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to top button */}
      {items.length > 10 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default InfiniteScrollApp;