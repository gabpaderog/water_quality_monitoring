type Status = "success" | "warning" | "danger" | "info";
type Size = "sm" | "md" | "lg";

interface BadgeProps {
  status: Status,
  label: string;
  size?: Size;
}

export const Badge = ({ status, label, size = "sm" }: BadgeProps) => {
  const baseClass = "w-fit items-center rounded-full font-semibold";

  const statusClassMap: Record<Status, string> = {
    success: "bg-green-50 text-green-600",
    warning: "bg-yellow-50 text-yellow-600",
    danger: "bg-red-50 text-red-600",
    info: "bg-blue-50 text-blue-600"
  };

  const sizeClassMap: Record<Size, string> = {
    sm: "text-xs px-3 py-0.5",
    md: "text-sm px-4 py-1.5",
    lg: "text-sm px-3 py-1",
  };

  const inlineClass = `${baseClass} ${statusClassMap[status]} ${sizeClassMap[size]}`;

  return <span className={inlineClass}>{label}</span>;
};
