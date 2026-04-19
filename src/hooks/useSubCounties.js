import { useState, useEffect } from 'react';
import api from '../services/api';

const useSubCounties = () => {
  const [subCounties, setSubCounties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/sub-counties');
        setSubCounties(response.data.data);
      } catch (err) {
        console.error('Failed to fetch sub counties:', err);
        setSubCounties([
          { id: 1, name: 'EMBU WEST' },
          { id: 2, name: 'EMBU NORTH' },
          { id: 3, name: 'RUNYENJES' },
          { id: 4, name: 'MBEERE NORTH' },
          { id: 5, name: 'MBEERE SOUTH' },
          { id: 6, name: 'MWEA' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { subCounties, loading };
};

export default useSubCounties;