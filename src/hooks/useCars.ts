import { useState, useEffect, useCallback } from 'react';
import { Car } from '@/data/cars';
import { CARS_ADMIN_URL } from '@/lib/adminApi';

export const useCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(CARS_ADMIN_URL);
      const data = await res.json();
      setCars(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { cars, loading, refetch };
};
