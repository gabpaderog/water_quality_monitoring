import Analyzer from "./Analyzer";

export default function Header() {
  return (
    <header className="mb-8 relative">
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-3xl font-semibold tracking-tight">
            IWRS
          </h1>
          <p className="text-muted-foreground mt-1 text-xs">
            Real-time monitoring of environmental parameters
          </p>
        </div>
        <Analyzer/>
      </div>

    </header>
  );
}
