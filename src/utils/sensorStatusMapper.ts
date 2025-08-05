type Status = "success" | "warning" | "danger" | "info";

interface StatusResponse {
  label: string;
  name: Status;
};

export const getPHStatus = (ph: number): StatusResponse => {
  if (ph < 5) return { label: "Very Acidic", name: "danger" };
  if (ph < 6) return { label: "Acidic", name: "warning" };
  if (ph <= 7.5) return { label: "Neutral", name: "success" };
  if (ph <= 8.5) return { label: "Alkaline", name: "info" };
  return { label: "Highly Alkaline", name: "danger" };
};

export const getTempStatus = (temp: number): StatusResponse => {
  if (temp < 10) return { label: "Freezing", name: "danger" };
  if (temp < 20) return { label: "Cold", name: "info" };
  if (temp < 28) return { label: "Optimal", name: "success" };
  if (temp < 35) return { label: "Warm", name: "warning" };
  return { label: "Hot", name: "danger" };
};

export const getTDSStatus = (tds: number): StatusResponse => {
  if (tds < 50) return { label: "Very Pure", name: "success" };
  if (tds < 150) return { label: "Ideal", name: "info" };
  if (tds < 300) return { label: "Fair", name: "warning" };
  if (tds < 500) return { label: "Poor", name: "danger" };
  return { label: "Contaminated", name: "danger" };
};

export const getTurbidityStatus = (turbidity: number): StatusResponse => {
  if (turbidity < 1) return { label: "Crystal Clear", name: "success" };
  if (turbidity < 5) return { label: "Clear", name: "info" };
  if (turbidity < 10) return { label: "Slightly Cloudy", name: "warning" };
  if (turbidity < 20) return { label: "Cloudy", name: "danger" };
  return { label: "Very Cloudy", name: "danger" };
};
