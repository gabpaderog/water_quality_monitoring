import Header from "./components/Header";
import MetricGrid from "./components/MetricGrid";
import WaterQualityChart from "./components/OverviewChart";
import useLatestMetrics from "./hooks/useLatestMetrics";


export default function App() {
  const metrics = useLatestMetrics();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <MetricGrid metrics={metrics} />

        <section className="space-y-4">
          <h2 className="text-xl font-medium">24-Hour Trend Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WaterQualityChart metric="ph" />
            <WaterQualityChart metric="temperature" />
            <WaterQualityChart metric="tds" />
            <WaterQualityChart metric="turbidity" />
          </div>
        </section>
      </div>
    </div>
  );
}
