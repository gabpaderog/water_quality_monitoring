import React, { useRef  } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler,
  Title,
} from "chart.js";
import "chartjs-adapter-luxon";
import { DateTime } from "luxon";
import { getDatabase, ref, query, orderByChild, startAt, endAt } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";
import { initializeApp } from "firebase/app";

// Firebase config
const firebaseConfig = {
  databaseURL: "https://waterqualitymonitoring-dfb69-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

initializeApp(firebaseConfig);

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Filler, Title);

const metricSettings: Record<string, { label: string; max: number }> = {
  ph: { label: "pH Levels", max: 14 },
  temperature: { label: "Temperature (°C)", max: 100 },
  tds: { label: "TDS (ppm)", max: 1000 },
  turbidity: { label: "Turbidity (NTU)", max: 100 },
};

const metricUnits: Record<string, string> = {
  ph: "pH",
  temperature: "°C",
  tds: "ppm",
  turbidity: "NTU",
};

type WaterChartProps = {
  metric?: "ph" | "temperature" | "tds" | "turbidity";
};

const WaterQualityChart: React.FC<WaterChartProps> = ({ metric = "ph" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"line", { x: number; y: number | null }[], unknown> | null>(null);

  const now = new Date();
  const currentMinute = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0);
  const startMinute = new Date(currentMinute.getTime() - 24 * 60 * 60 * 1000);
  const startTimestamp = Math.floor(startMinute.getTime() / 1000 / 300) * 300;
  const endTimestamp = Math.floor(currentMinute.getTime() / 1000 / 300) * 300;

  const db = getDatabase();
  const dataQuery = query(
    ref(db, "test"),
    orderByChild("timestamp"),
    startAt(startTimestamp),
    endAt(endTimestamp)
  );

  type WaterDataEntry = {
    timestamp: number;
    ph?: number;
    temperature?: number;
    tds?: number;
    turbidity?: number;
  };
  
    const [data, loading, error] = useObjectVal<Record<string, WaterDataEntry>>(dataQuery);

  if (data && canvasRef.current && !chartRef.current) {
    const maxPer5Min: Record<number, number> = {};

    Object.values(data).forEach((entry) => {
      const waterEntry = entry as WaterDataEntry;
      if (
        typeof waterEntry.timestamp === "number" &&
        typeof waterEntry[metric] === "number"
      ) {
        const ts = Number(waterEntry.timestamp);
        const bucket = Math.floor(ts / 300) * 300;
        const value = waterEntry[metric] as number;
        if (!maxPer5Min[bucket] || value > maxPer5Min[bucket]) {
          maxPer5Min[bucket] = value;
        }
      }
    });

    const formattedData: { x: number; y: number | null }[] = [];
    for (let t = startTimestamp; t <= endTimestamp; t += 300) {
      formattedData.push({
        x: t * 1000, // Use timestamp in ms (number)
        y: maxPer5Min[t] !== undefined ? maxPer5Min[t] : null,
      });
    }

    const ctx = canvasRef.current.getContext("2d");
    const unit = metricUnits[metric] || metric;
    const settings = metricSettings[metric] || { label: metric, max: 100 };

    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: settings.label,
              data: formattedData,
              borderColor: "#0ea5e9",
              backgroundColor: "rgba(14,165,233,0.2)",
              tension: 0.3,
              fill: true,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          spanGaps: false,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "hour",
                tooltipFormat: "MMM d, HH:mm",
                displayFormats: { hour: "HH:mm" },
              },
              grid: { drawOnChartArea: false, drawTicks: false, display: false },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 8,
                callback: function (tickValue: string | number) {
                  const value = typeof tickValue === "string" ? parseInt(tickValue, 10) : tickValue;
                  const dt = DateTime.fromMillis(value);
                  return dt.hour === 0 ? dt.toFormat("MMM d") : dt.toFormat("HH:mm");
                },
              },
            },
            y: {
              beginAtZero: true,
              suggestedMax: settings.max,
              title: {
                display: true,
                text: settings.label,
              },
            },
          },
          interaction: {
            mode: "nearest",
            intersect: false,
            axis: "x",
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                label: (context) => {
                  const value = context.parsed.y?.toFixed(2);
                  return `${value}${unit}`;
                },
              },
            },
          },
        },
      });
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {metricSettings[metric].label} - Last 24 Hours
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading data</p>}
      <canvas ref={canvasRef} height={100}></canvas>
    </div>
  );
};

export default WaterQualityChart;
