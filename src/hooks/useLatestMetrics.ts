// hooks/useLatestMetrics.ts
import { initializeApp } from "firebase/app";
import { getDatabase, ref, DataSnapshot } from "firebase/database";
import { useList } from "react-firebase-hooks/database";

const firebaseConfig = {
  databaseURL:
    "https://waterqualitymonitoring-dfb69-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

type MetricEntry = {
  ph: number;
  temperature: number;
  tds: number;
  turbidity: number;
  timestamp: number;
};

type MetricData = Omit<MetricEntry, "timestamp">;

export default function useLatestMetrics(): MetricData {
  const query = ref(db, "test");
  const [snapshots, loading, error] = useList(query);

  if (loading || error || !snapshots?.length) {
    return { ph: 0, temperature: 0, tds: 0, turbidity: 0 };
  }

  const latest = snapshots
    .map((snap: DataSnapshot) => snap.val() as MetricEntry)
    .reduce((a, b) => (a.timestamp > b.timestamp ? a : b));

  const { ph, temperature, tds, turbidity } = latest;
  return { ph, temperature, tds, turbidity };
}
