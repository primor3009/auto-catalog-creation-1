import { useState, useEffect, useCallback } from 'react';
import { Car } from '@/data/cars';
import { CARS_ADMIN_URL } from '@/lib/adminApi';

export const useCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    let lastError: unknown = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(CARS_ADMIN_URL);
        const data = await res.json();
        setCars(Array.isArray(data) ? data : []);
        setLoading(false);
        return;
      } catch (err) {
        lastError = err;
        if (attempt < 2) await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
      }
    }
    console.error('Не удалось загрузить список автомобилей:', lastError);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { cars, loading, refetch };
};