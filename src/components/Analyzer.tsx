// src/components/WaterQualityAnalyzer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { analyzeWaterQuality } from '../services/gemini';
import { getDatabase, ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';

// Interface for the water quality data
interface WaterQualityData {
  ph: number;
  turbidity: number;
  tds: number;
  temperature: number;
  timestamp: string;
}

const Analyzer: React.FC = () => {
  const [data, setData] = useState<WaterQualityData | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Fetch latest water quality data from Firebase
  useEffect(() => {
    const db = getDatabase();
    const readingsRef = query(ref(db, 'test'), orderByChild('timestamp'), limitToLast(1));

    const unsubscribe = onValue(readingsRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const val = childSnapshot.val();
        setData({
          ph: val.ph,
          turbidity: val.turbidity,
          tds: val.tds,
          temperature: val.temperature,
          timestamp: val.timestamp,
        });
      });
    });

    return () => unsubscribe();
  }, []);

  // Detect outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
        setAnalysis('');
      }
    };

    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupOpen]);

  const handleAnalyzeData = async () => {
    if (!data) return;

    setLoading(true);
    setError(null);
    setAnalysis('');
    setIsPopupOpen(false);

    try {
      const result = await analyzeWaterQuality(data);
      setAnalysis(result);
      setIsPopupOpen(true);
    } catch (err) {
      console.error(err);
      setError('An error occurred while analyzing the data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 relative">
      <button
        className="py-2 px-4 bg-blue-500 text-white font-semibold rounded text-xs sm:text-base"
        onClick={handleAnalyzeData}
        disabled={loading || !data}
      >
        {loading ? 'Analyzing...' : 'Analyze Water Quality'}
      </button>

      {!data && <p className="mt-2 text-gray-500">Fetching latest water quality data...</p>}

      {isPopupOpen && analysis && (
        <div
          ref={popupRef}
          className="w-full max-w-[400px] absolute top-10 right-0 bg-white p-4 mt-4 rounded shadow z-10"
        >
          <h3 className="font-bold mb-2">Analysis:</h3>
          <p>{analysis}</p>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Analyzer;
