'use client';

import { useState, useMemo } from 'react';
import { 
  searchDictionary, 
  getAllEntries, 
  getSessionEntries,
  searchSession,
  getAvailableSessions,
  getTotalEntryCount,
  type DictionaryEntry 
} from '@/app/data/dictionary';

export default function DictionarySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DictionaryEntry[]>(getAllEntries());
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  
  // Get available sessions
  const availableSessions = useMemo(() => getAvailableSessions(), []);
  const totalEntries = useMemo(() => getTotalEntryCount(), []);

  // Handle session selection
  const handleSessionChange = (sessionNumber: number) => {
    const newSession = selectedSession === sessionNumber ? null : sessionNumber;
    setSelectedSession(newSession);
    
    if (newSession === null) {
      // Show all entries
      if (!searchQuery.trim()) {
        setSearchResults(getAllEntries());
      } else {
        setSearchResults(searchDictionary(searchQuery));
      }
    } else {
      // Show specific session
      if (!searchQuery.trim()) {
        setSearchResults(getSessionEntries(newSession));
      } else {
        setSearchResults(searchSession(newSession, searchQuery));
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // Empty search - show current session or all
      if (selectedSession !== null) {
        setSearchResults(getSessionEntries(selectedSession));
      } else {
        setSearchResults(getAllEntries());
      }
    } else {
      // Search with query
      if (selectedSession !== null) {
        setSearchResults(searchSession(selectedSession, query));
      } else {
        setSearchResults(searchDictionary(query));
      }
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          De verborum significatione
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Dictionary of Marcos Varrus Flaccus
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for Latin words, definitions, or examples..."
            className="w-full px-4 py-3 pl-12 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Session Selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={() => handleSessionChange(null as any)}
            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
              selectedSession === null
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
            }`}
          >
            All Sessions ({totalEntries})
          </button>
          {availableSessions.map((session) => (
            <button
              key={session.number}
              onClick={() => handleSessionChange(session.number)}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                selectedSession === session.number
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
              }`}
            >
              Session {session.number} ({session.entryCount})
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {searchResults.length} {searchResults.length === 1 ? 'entry' : 'entries'} found
          {selectedSession !== null && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
              Session {selectedSession}
            </span>
          )}
        </div>

        {searchResults.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No entries found for "{searchQuery}"
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          searchResults.map((entry, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {highlightText(entry.word, searchQuery)}
                </h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
                    Definition
                  </h4>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {highlightText(entry.definition, searchQuery)}
                  </p>
                </div>
                
                {entry.example && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
                      Example
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                      {highlightText(entry.example, searchQuery)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          Based on the work of <span className="font-semibold">Marcos Varrus Flaccus</span>
        </p>
      </div>
    </div>
  );
}