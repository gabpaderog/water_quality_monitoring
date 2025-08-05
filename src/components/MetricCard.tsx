import { Droplet, Thermometer, Waves, Eye } from "lucide-react";
import { Badge } from "./Badge";
import { getPHStatus, getTDSStatus, getTempStatus, getTurbidityStatus } from "../utils/sensorStatusMapper";

const typeConfig = {
  ph: {
    icon: Droplet,
    unit: "",
    color: "text-blue-600",
    bg: "bg-blue-50",
    getStatus: getPHStatus,
  },
  temperature: {
    icon: Thermometer,
    unit: "°C",
    color: "text-red-600",
    bg: "bg-red-50",
    getStatus: getTempStatus,
  },
  tds: {
    icon: Waves,
    unit: "ppm",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    getStatus: getTDSStatus,
  },
  turbidity: {
    icon: Eye,
    unit: "NTU",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    getStatus: getTurbidityStatus,
  },
} as const;


type MetricCardProps = {
  type: "ph" | "temperature" | "tds" | "turbidity";
  value: number;
};

export default function MetricCard({ type, value }: MetricCardProps) {
  const config = typeConfig[type];
  const status = config.getStatus(value);
  const Icon = config.icon;


  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow transition duration-200">
      <div className="flex sm:grid items-center gap-4">
        <div className={`${config.bg} p-3 rounded w-fit`}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>
        <div className="w-full flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 capitalize">{type}</p>
            <p className="text-2xl font-bold">
              {value} <span className="text-sm">{config.unit}</span>
            </p>
          </div>
          <Badge status={status.name} label={status.label} />
        </div>
      </div>
    </div>
  );
}
