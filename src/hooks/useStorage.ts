'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tarot-bookmarks';
const RECENT_KEY = 'tarot-recent';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setBookmarks(JSON.parse(stored));
  }, []);

  const toggleBookmark = useCallback((cardId: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback((cardId: string) => bookmarks.includes(cardId), [bookmarks]);

  return { bookmarks, toggleBookmark, isBookmarked };
}

export function useRecentViews() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  const addRecentView = useCallback((cardId: string) => {
    setRecent((prev) => {
      const next = [cardId, ...prev.filter((id) => id !== cardId)].slice(0, 10);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recent, addRecentView };
}
