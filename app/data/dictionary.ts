// Dictionary data loader for "De verborum significatione" by Marcos Varrus Flaccus
// Now loading from JSON session files

import session1 from './sessions/session1.json';
import session2 from './sessions/session2.json';
import session3 from './sessions/session3.json';

export interface DictionaryEntry {
  word: string;
  definition: string;
  example?: string;
}

// Session data mapping
const SESSIONS = {
  session1: session1 as DictionaryEntry[],
  session2: session2 as DictionaryEntry[],
  session3: session3 as DictionaryEntry[]
};

// Cache for loaded data
let cachedAllEntries: DictionaryEntry[] | null = null;
let cachedSessionData: Record<string, DictionaryEntry[]> | null = null;

// Load all session data and combine
const loadAllEntries = (): DictionaryEntry[] => {
  if (cachedAllEntries) return cachedAllEntries;
  
  const allEntries: DictionaryEntry[] = [];
  Object.values(SESSIONS).forEach(sessionData => {
    allEntries.push(...sessionData);
  });
  
  // Sort alphabetically for consistent display
  cachedAllEntries = allEntries.sort((a, b) => a.word.localeCompare(b.word));
  return cachedAllEntries;
};

// Load all session data separately for session-based operations
const loadSessionData = (): Record<string, DictionaryEntry[]> => {
  if (cachedSessionData) return cachedSessionData;
  
  cachedSessionData = {};
  Object.entries(SESSIONS).forEach(([sessionName, sessionData]) => {
    cachedSessionData![sessionName] = [...sessionData].sort((a, b) => 
      a.word.localeCompare(b.word)
    );
  });
  
  return cachedSessionData;
};

// Search across all entries
export const searchDictionary = (query: string): DictionaryEntry[] => {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase().trim();
  const allEntries = loadAllEntries();
  
  return allEntries.filter(entry => 
    entry.word.toLowerCase().includes(lowercaseQuery) ||
    entry.definition.toLowerCase().includes(lowercaseQuery) ||
    (entry.example && entry.example.toLowerCase().includes(lowercaseQuery))
  );
};

// Get all entries
export const getAllEntries = (): DictionaryEntry[] => {
  return loadAllEntries();
};

// Get entries from specific session
export const getSessionEntries = (sessionNumber: number): DictionaryEntry[] => {
  const sessionData = loadSessionData();
  const sessionKey = `session${sessionNumber}` as keyof typeof sessionData;
  return sessionData[sessionKey] || [];
};

// Search within specific session
export const searchSession = (sessionNumber: number, query: string): DictionaryEntry[] => {
  if (!query.trim()) return getSessionEntries(sessionNumber);
  
  const lowercaseQuery = query.toLowerCase().trim();
  const sessionEntries = getSessionEntries(sessionNumber);
  
  return sessionEntries.filter(entry => 
    entry.word.toLowerCase().includes(lowercaseQuery) ||
    entry.definition.toLowerCase().includes(lowercaseQuery) ||
    (entry.example && entry.example.toLowerCase().includes(lowercaseQuery))
  );
};

// Get available sessions
export const getAvailableSessions = (): { number: number; name: string; entryCount: number }[] => {
  const sessionData = loadSessionData();
  return Object.entries(sessionData).map(([sessionName, entries]) => ({
    number: parseInt(sessionName.replace('session', '')),
    name: sessionName,
    entryCount: entries.length
  }));
};

// Get total entry count
export const getTotalEntryCount = (): number => {
  return loadAllEntries().length;
};

// Clear cache (useful for development or memory management)
export const clearDictionaryCache = (): void => {
  cachedAllEntries = null;
  cachedSessionData = null;
};