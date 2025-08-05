import MetricCard from "./MetricCard";

type MetricData = {
  ph: number;
  temperature: number;
  tds: number;
  turbidity: number;
};

function MetricGrid({ metrics }: { metrics: MetricData }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {(Object.entries(metrics) as [keyof MetricData, number][]).map(
        ([key, value]) => (
          <MetricCard key={key} type={key} value={value} />
        )
      )}
    </section>
  );
}

export default MetricGrid;