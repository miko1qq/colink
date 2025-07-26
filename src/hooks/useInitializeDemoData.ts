import { useEffect, useState } from 'react';
import { initializeDemoData } from '@/lib/demoData';

export const useInitializeDemoData = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      // Check if already initialized in this session
      const initialized = sessionStorage.getItem('demoDataInitialized');
      if (initialized) {
        setIsInitialized(true);
        return;
      }

      setIsLoading(true);
      try {
        await initializeDemoData();
        sessionStorage.setItem('demoDataInitialized', 'true');
        setIsInitialized(true);
        console.log('Demo data initialized successfully');
      } catch (error) {
        console.error('Failed to initialize demo data:', error);
        // Still mark as initialized to prevent retry loops
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  return { isInitialized, isLoading };
};